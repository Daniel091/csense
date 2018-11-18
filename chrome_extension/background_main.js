chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: '#3aa757'});
    chrome.storage.sync.set({shouldRun: false});
});

var task_timer;
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ('shouldRun' in changes) {
        chrome.storage.sync.get('shouldRun', function (data) {

            if (data.shouldRun) {
                task_timer = setInterval(snap_fun, 1000);
            } else {
                clearInterval(task_timer);
            }

        });
    }
    
    if('lights_on_off' in changes){
        chrome.storage.sync.get('lights_on_off', function (data) {
            chrome.runtime.sendMessage({lights_on_off: data.lights_on_off}, undefined);
        });
    }
});

function snap_fun() {
    chrome.tabs.captureVisibleTab(null, {quality: 10}, function (image) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {image_data: image}, function (response) {
            });
        });
    });
}



