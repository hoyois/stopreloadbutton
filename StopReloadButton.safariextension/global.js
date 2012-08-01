// Returns the toolbar item in a given window, if any
function toolbarItem(window) {
	for(var i = 0; i < safari.extension.toolbarItems.length; i++) {
		if(safari.extension.toolbarItems[i].browserWindow === window) {
			return safari.extension.toolbarItems[i];
		}
	}
}

function makeReloadButton(button) {
	button.image = safari.extension.baseURI + "reload.pdf";
	button.label = "Reload";
	button.toolTip = "Reload";
}

function makeStopButton(button) {
	button.image = safari.extension.baseURI + "stop.pdf";
	button.label = "Stop";
	button.toolTip = "Stop";
}

function makeInitialButton(button) {
	if(safari.extension.settings.initialButton === "stop") makeStopButton(button);
	else makeReloadButton(button);
}

function execute(event) {
	var tab = event.target.browserWindow.activeTab;
	if(event.target.label === "Reload") {
		tab.page.dispatchMessage("reload", "");
	} else {
		makeReloadButton(event.target);
		tab.page.dispatchMessage("stop", "");
		tab.isLoading = false;
	}
}

function validate(event) {
	var tab = event.target.browserWindow.activeTab;
	if(!tab || (!tab.isLoading && (!tab.page || !tab.url))) {
		makeInitialButton(event.target);
		event.target.disabled = true;
	} else {
		event.target.disabled = false;
		if(tab.isLoading) makeStopButton(event.target);
		else makeReloadButton(event.target);
	}
}

function handleMessage(event) {
	var tab = event.target;
	tab.isLoading = event.message && tab.page;
	if(tab === tab.browserWindow.activeTab) {
		var button = toolbarItem(tab.browserWindow);
		if(!button) return;
		if(tab.page) {
			button.disabled = false;
			if(event.message) makeStopButton(button);
			else makeReloadButton(button);
		} else {
			makeInitialButton(button);
			button.disabled = true;
		}
	}
}

safari.application.addEventListener("command", execute, false);
safari.application.addEventListener("validate", validate, false);
safari.application.addEventListener("message", handleMessage, false);
