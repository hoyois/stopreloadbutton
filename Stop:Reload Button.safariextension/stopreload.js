if(window === window.top) {
    var isLoading = true;
    
    safari.self.tab.dispatchMessage("0", true);
    
    function handleLoadEvent(event) {
        window.addEventListener("beforeunload", handleBeforeUnloadEvent, true);
        isLoading = false;
        safari.self.tab.dispatchMessage("0", false);
    }
    
    function handleBeforeUnloadEvent(event) {
        window.removeEventListener("beforeunload", handleBeforeUnloadEvent, true);
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
    
    window.addEventListener("pageshow", handleLoadEvent, true);
    safari.self.addEventListener("message", handleMessage, false);
}