if(window === window.top) {
	
	function handleLoadEvent(event) {
		// NB "load" is fired on bookmarks:// and topsites:// also!
		safari.self.tab.dispatchMessage("load");
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