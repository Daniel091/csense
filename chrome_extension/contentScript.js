console.log("Script injected");

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.image_data) {
            appendImage(request.image_data)
        }
    }
);

// sends color back to background script
function sendColorMessage(color) {
    chrome.runtime.sendMessage({web_color_avg: color}, undefined);
}

// appends image to DOM, to easily decode base64 jpeg
// really ugly workaround
function appendImage(image) {
    var con = document.getElementById("cIm2con789Container");
    if (con === null) {
        con = document.createElement('div');
        con.setAttribute("id", "cIm2con789Container");
    }
    con.innerHTML = "<img id='current_image' style='display: none' src='" + image + "'/>";
    document.body.appendChild(con);

    let tmp_img = document.getElementById('current_image');
    let color = getAverageRGB(tmp_img);
    console.log(color + " Computed Color" + window.location);
    if (color === undefined) {
        console.log("No Image Available");
        return
    }
    sendColorMessage(color);
}


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
