let all_switch = document.getElementById('all_switch');
all_switch.onclick = function () {
    chrome.storage.sync.set({'lights_on_off': all_switch.checked});
};
