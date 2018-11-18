chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: '#3aa757'});
    chrome.storage.sync.set({shouldRun: false});
    chrome.storage.sync.set({lights_on_off: false});
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
});

function snap_fun() {
    chrome.tabs.captureVisibleTab(null, {quality: 10}, function (image) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {image_data: image});
        });
    });
}



