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
		makeStopButton(event.target);
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
		event.target.disabled = true;
		makeInitialButton(event.target);
	} else {
		event.target.disabled = false;
		if(tab.isLoading) makeStopButton(event.target);
		else makeReloadButton(event.target);
	}
}

function handleBeforeNavigate(event) {
	var tab = event.target;
	tab.isLoading = event.url !== null;
	if(tab === tab.browserWindow.activeTab) {
		var button = toolbarItem(tab.browserWindow);
		if(!button) return;
		if(event.url) {
			button.disabled = false;
			makeStopButton(button);
		} else {
			button.disabled = true;
			makeInitialButton(button);
		}
	}
}

// Cannot use the navigate event because it is fired after beforeNavigate
// when leaving a loading page
function handleMessage(event) {
	var tab = event.target;
	tab.isLoading = false;
	if(tab === tab.browserWindow.activeTab) {
		var button = toolbarItem(tab.browserWindow);
		if(!button) return;
		if(event.message === "bookmarks:" || event.message === "topsites:") {
			button.disabled = true;
			makeInitialButton(button);
		} else {
			button.disabled = false;
			makeReloadButton(button);
		}
	}
}

safari.application.addEventListener("command", execute, false);
safari.application.addEventListener("validate", validate, false);
safari.application.addEventListener("beforeNavigate", handleBeforeNavigate, true);
safari.application.addEventListener("message", handleMessage, false);