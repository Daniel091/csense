/*
 BUTTON COLOR CHANGER TEST
 */

let changeColor = document.getElementById('changeColor');

// sets btn color to color from storage
chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

/*
 AUTO COLOR SWITCH STUFF
 */

let auto_switch = document.getElementById('auto_switch');

auto_switch.onclick = function () {
    if (auto_switch.checked) {
        chrome.storage.sync.set({shouldRun: true});
    } else {
        chrome.storage.sync.set({shouldRun: false});
    }
};

document.body.onload = function () {
    chrome.storage.sync.get('shouldRun', function (data) {
        auto_switch.checked = data.shouldRun;
    });
    
    chrome.storage.sync.get('lights_on_off', function (data) {
        all_switch.checked = data.lights_on_off;
    });
};


/*
var UID = {
    _current: 0,
    getNew: function () {
        this._current++;
        return this._current;
    }
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

HTMLElement.prototype.pseudoStyle = function (element, prop, value) {
    var _this = this;
    var _sheetId = "pseudoStyles";
    var _head = document.head || document.getElementsByTagName('head')[0];
    var _sheet = document.getElementById(_sheetId) || document.createElement('style');
    _sheet.id = _sheetId;
    var className = "pseudoStyle" + UID.getNew();

    _this.className += " " + className;

    _sheet.innerHTML += " ." + className + ":" + element + "{" + prop + ":" + value + "}";
    _head.appendChild(_sheet);
    return this;
};
*/



