if(window === window.top) {
    var isLoading = true;
    
    // Need to register this tab in the global page
    // The only way to do it is with a fake beforeload event...
    var event = document.createEvent("HTMLEvents");
    event.initEvent("beforeload", false, true);
    var tabID = safari.self.tab.canLoad(event, "");
    
    safari.self.tab.dispatchMessage("loading", tabID);
 
    function handleLoadEvent(event) {
        window.addEventListener("beforeunload", handleBeforeUnloadEvent, true);
        isLoading = false;
        safari.self.tab.dispatchMessage("done", tabID);
    }
    
    function handleBeforeUnloadEvent(event) {
        window.removeEventListener("beforeunload", handleBeforeUnloadEvent, true);
        safari.self.tab.dispatchMessage("unload", tabID);
    }
    
    function handleMessage(event) {
        switch(event.name) {
            case "validate":
                safari.self.tab.dispatchMessage(isLoading ? "loading" : "done", tabID);
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