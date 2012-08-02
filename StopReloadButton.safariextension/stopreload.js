if(window === window.top) {
	
	function handleLoadEvent() {
		safari.self.tab.dispatchMessage("load", location.protocol);
	}
	
	function handleMessage(event) {
		switch(event.name) {
			case "reload":
				window.location.reload();
				break;
			case "stop":
				window.stop();
				break;
		}
	}
	
	window.addEventListener("pageshow", handleLoadEvent, true);
	safari.self.addEventListener("message", handleMessage, false);
}