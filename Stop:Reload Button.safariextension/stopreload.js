if(window === window.top) {
    var isLoading = true;
    
    safari.self.tab.dispatchMessage("0", true);
    
    function handleLoadEvent(event) {
        isLoading = false;
        safari.self.tab.dispatchMessage("0", false);
    }
    
    function handleBeforeUnloadEvent(event) {
        safari.self.tab.dispatchMessage("0", true);
    }
    
    function handleMessage(event) {
        switch(event.name) {
            case "validate":
                safari.self.tab.dispatchMessage("0", isLoading);
                break;
            case "reload":
                window.location.reload();
                break;
            case "stop":
                window.stop();
                isLoading = false;
                break;
        }
    }
    
    window.addEventListener("load", handleLoadEvent, true);
    window.addEventListener("beforeunload", handleBeforeUnloadEvent, true);
    safari.self.addEventListener("message", handleMessage, false);
}