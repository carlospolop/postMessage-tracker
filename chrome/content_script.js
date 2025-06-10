/*
History is needed to hijack pushState-changes
addEventListener to hijack the message-handlers getting registered
defineSetter to handle old way of setting onmessage
beforeunload to track page changes (since we see no diff btw fragmentchange/pushstate and real location change

we also look for event.dispatch.apply in the listener, if it exists, we find a earlier stack-row and use that one
also, we look for jQuery-expandos to identify events being added later on by jQuery's dispatcher
*/

document.addEventListener('postMessageTracker', function(event) {
        chrome.runtime.sendMessage(event.detail);
});

//we use this to separate fragment changes with location changes
window.addEventListener('beforeunload', function(event) {
        var storeEvent = new CustomEvent('postMessageTracker', {'detail':{changePage:true}});
        document.dispatchEvent(storeEvent);
});

(function() {
    if (document.contentType === 'application/xml') {
        return;
    }
    var script = document.createElement('script');
    script.setAttribute('src', chrome.runtime.getURL('injected.js'));
    document.documentElement.appendChild(script);
})();
