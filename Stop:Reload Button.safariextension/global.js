var button = safari.extension.toolbarItems[0];

function makeReloadButton() {
    button.image = safari.extension.baseURI + "reload_button.png";
    button.label = "Reload";
    button.toolTip = "Reload";
}

function makeStopButton() {
    button.image = safari.extension.baseURI + "stop_button.png";
    button.label = "Stop";
    button.toolTip = "Stop";
}

function makeInitialButton() {
    if(safari.extension.settings.initialButton === "stop") makeStopButton();
    else makeReloadButton();
}

function execute(event) {
    if(button.label === "Reload") {
        makeStopButton();
        event.target.browserWindow.activeTab.page.dispatchMessage("reload", "");
    } else {
        makeReloadButton();
        event.target.browserWindow.activeTab.page.dispatchMessage("stop", "");
    }
}
 
function validate(event) {
    if(!event.target.browserWindow.activeTab.page || !event.target.browserWindow.activeTab.url) {
        makeInitialButton();
        event.target.disabled = true;
    } else {
        event.target.disabled = false;
        event.target.browserWindow.activeTab.page.dispatchMessage("validate", "");
    }
}

function handleMessage(event) {
    if(!event.target.browserWindow.activeTab.page) return;
    button.disabled = false;
    if(event.message) makeStopButton();
    else makeReloadButton();
}

safari.application.addEventListener("command", execute, false);
safari.application.addEventListener("validate", validate, false);
safari.application.addEventListener("message", handleMessage, false);

