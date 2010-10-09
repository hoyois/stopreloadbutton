if(window === window.top) {
    var isLoading = true;
    var isActive = true;
    
    safari.self.tab.dispatchMessage("isLoading", true);
 
    function handleLoadEvent(event) {
        window.addEventListener("beforeunload", handleBeforeUnloadEvent, true);
        isLoading = false;
        if(isActive) safari.self.tab.dispatchMessage("isLoading", false);
    }
    
    function handleBeforeUnloadEvent(event) {
        window.removeEventListener("beforeunload", handleBeforeUnloadEvent, true);
        if(isActive) safari.self.tab.dispatchMessage("isLoading", true);
    }
    
    function handleMessage(event) {
        switch(event.name) {
            case "validate":
                if(isActive) safari.self.tab.dispatchMessage("isLoading", isLoading);
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
    window.addEventListener("focus", function() {isActive = true;}, true);
    window.addEventListener("blur", function() {isActive = false;}, true);
    safari.self.addEventListener("message", handleMessage, false);
}