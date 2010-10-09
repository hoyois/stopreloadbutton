// Need to keep track of tabs manually because message events have no 'tab' property
var tabCount = 0;
var tabs = new Array();

// Returns the toolbar item in a given window, if any
function toolbarItem(window) {
    for(var i = 0; i < safari.extension.toolbarItems.length; i++) {
        if(safari.extension.toolbarItems[i].browserWindow === window) {
            return safari.extension.toolbarItems[i];
        }
    }
}

function makeReloadButton(button) {
    button.image = safari.extension.baseURI + "reload_button.png";
    button.label = "Reload";
    button.toolTip = "Reload";
}

function makeStopButton(button) {
    button.image = safari.extension.baseURI + "stop_button.png";
    button.label = "Stop";
    button.toolTip = "Stop";
}

function makeInitialButton(button) {
    if(safari.extension.settings.initialButton === "stop") makeStopButton(button);
    else makeReloadButton(button);
}

function execute(event) {
    if(event.target.label === "Reload") {
        makeStopButton(event.target);
        event.target.browserWindow.activeTab.page.dispatchMessage("reload", "");
    } else {
        makeReloadButton(event.target);
        event.target.browserWindow.activeTab.page.dispatchMessage("stop", "");
    }
}
 
function validate(event) {
    if(!event.target.browserWindow.activeTab.page || !event.target.browserWindow.activeTab.url) {
        makeInitialButton(event.target);
        event.target.disabled = true;
    } else {
        event.target.disabled = false;
        event.target.browserWindow.activeTab.page.dispatchMessage("validate", "");
    }
}

function handleMessage(event) {
    if(event.name === "canLoad") {
        tabs[tabCount] = safari.application.activeBrowserWindow.activeTab;
        event.message = tabCount++;
        return;
    }
    // Only change the button if the message comes from an active tab
    if(tabs[event.message].browserWindow.activeTab === tabs[event.message]) {
        var button = toolbarItem(tabs[event.message].browserWindow);
        if(!button || !button.browserWindow.activeTab.page) return;
        button.disabled = false;
        if(event.name === "done") makeReloadButton(button);
        else makeStopButton(button); // event.name is either 'loading' or 'unload'
    }
    if(event.name === "unload") {
        delete tabs[event.message];
    }
}

safari.application.addEventListener("command", execute, false);
safari.application.addEventListener("validate", validate, false);
safari.application.addEventListener("message", handleMessage, false);

