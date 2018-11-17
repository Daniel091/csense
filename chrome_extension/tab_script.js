/*
 BUTTON COLOR CHANGER TEST
 */

let changeColor = document.getElementById('changeColor');

// sets btn color to color from storage
chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        console.log(request)
    });

// sets green for everything
changeColor.onclick = function (ele) {
    // let color = ele.target.value;
    // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //     console.log(tabs);
    //     chrome.tabs.executeScript(
    //         tabs[0].id,
    //         {code: 'document.body.style.backgroundColor = "' + color + '";'});
    // });
};

let messageButton = document.getElementById('message-button')
messageButton.onclick = function (e) {
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        console.log(response);
    });
}

/*
 AUTO COLOR SWITCH STUFF
 */

let auto_switch = document.getElementById('auto_switch');
var checked = false;
var timerTask;

auto_switch.onclick = function () {
    checked = !checked;

    if (checked) {
        get_color();
        timerTask = setInterval(get_color, 1000);
    } else {
        clearInterval(timerTask);
        console.log("Stopped Task");
    }
};


function get_color() {
    chrome.tabs.captureVisibleTab(null, {quality: 50}, function (image) {
        let screen_con = document.getElementById('screen_con');
        screen_con.innerHTML = "<img style='display:none' id='current_image' src='" + image + "'/>";


        var tmp = document.getElementById('current_image');
        if (tmp !== undefined) {
            color = getAverageRGB(tmp)
            color_hex = rgbToHex(color.r, color.g, color.b)
            elem = document.querySelector('.slider')
            elem.pseudoStyle('before', 'background-color', color_hex)
        } else {
            console.log("No Image Available");
        }

    });
}

var UID = {
	_current: 0,
	getNew: function(){
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

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();
	
	_this.className +=  " "+className; 
	
	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};

function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r: 0, g: 0, b: 0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r: 0, g: 0, b: 0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    if (width !== 0 && height !== 0) {
        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            return undefined;
        }
    } else {
        return undefined;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
}



