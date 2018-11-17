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

var timerTask;

function get_and_set_color_task(){
    if(localStorage.getItem('shouldRun') == 'true'){
        get_color();
    }else{
        clearInterval(timerTask);
    }
}

let auto_switch = document.getElementById('auto_switch');
var checked = auto_switch.checked;

auto_switch.onclick = function () {
    //checked = !checked;

    console.log(localStorage['shouldRun'])
    if(localStorage.getItem('shouldRun') == undefined){
        
    }
    
    if (auto_switch.checked) {
        timerTask = setInterval(get_and_set_color_task, 1000);
        localStorage.setItem('shouldRun',  'true');
    } else {
        //clearInterval(timerTask);
        //console.log("Stopped Task");
        localStorage.setItem('shouldRun',  'false');
    }
};

document.body.onload = function(){
    console.log(localStorage['shouldRun'])
    if(localStorage.getItem('shouldRun') == undefined){
        localStorage.setItem('shouldRun',  'false');
    }
    auto_switch.checked = (localStorage.getItem('shouldRun') == 'true');
    
    if (localStorage.getItem('shouldRun') == 'true') {
        timerTask = setInterval(get_and_set_color_task, 1000);
    }
}


function get_color() {
    chrome.tabs.captureVisibleTab(null, {quality: 50}, function (image) {
        let screen_con = document.getElementById('screen_con');
        screen_con.innerHTML = "<img style='display:none' id='current_image' src='" + image + "'/>";


        var tmp = document.getElementById('current_image');
        if (tmp !== undefined) {
            color = getAverageRGB(tmp)
            
            //fuck up colors a bit (increases red channel when overall intensity is small)
            // evil math magic etc.
            
            abs = Math.sqrt(color.r*color.r+color.g*color.g+color.b*color.b)/442.;
            
            color.r = parseInt(color.r + color.r*Math.pow((1-abs), 1.5))
            if(color.r>255){
                color.r=255
            }
            
            // end evil math magic
            
            if(color != undefined && tmp != undefined){
                
                color_hex = rgbToHex(color.r, color.g, color.b)
                console.log(color_hex)
                elem = document.querySelector('.slider')
                elem.pseudoStyle('before', 'background-color', color_hex)
                setGroupRGBById("3", color.r/255, color.g/255, color.b/255, .6, 3.);
                //console.log(JSON.stringify(weighted_hsv));
                //gamma = 1.5
                //setGroupHSVById("3", weighted_hsv.h*65536, Math.pow(weighted_hsv.s, gamma)*255, weighted_hsv.v*255);
            }
            
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


function getGaussianWeightedAverageHSV(imgEl) {

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

    h = 0.;
    s = 0.;
    v = 0.;
    
    quench = 12.;
    while ((i += blockSize * 4) < length) {
        ++count;
        r_ = data.data[i];
        g_ = data.data[i + 1];
        b_ = data.data[i + 2];
        
        hsv = rgb2hsv(r_/255, g_/255, b_/255);
        
        h+=hsv.h;
        s+=hsv.s;
                
        X = (v - .5)
        // use a gaussuan weight in averaging the V, so that high V and low V are 
        // counted less
        
        v+=Math.exp(-X*X*quench) * hsv.v;
        
    }

    hsv = {
        'h' : h/count,
        's' : s/count,
        'v' : v/count
    };
    return hsv;
}




