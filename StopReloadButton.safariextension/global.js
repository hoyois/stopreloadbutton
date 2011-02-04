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
    var tab = event.target;
    // Only change the button if the message comes from an active tab
    if(tab.browserWindow.activeTab === tab && tab.page) {
        var button = toolbarItem(tab.browserWindow);
        if(!button) return;
        button.disabled = false;
        if(event.message) makeStopButton(button);
        else makeReloadButton(button);
    }
}

safari.application.addEventListener("command", execute, false);
safari.application.addEventListener("validate", validate, false);
safari.application.addEventListener("message", handleMessage, false);

