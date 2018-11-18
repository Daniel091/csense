chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.web_color_avg) {
            console.log(request.web_color_avg);

            var color = request.web_color_avg;

            //fuck up colors a bit (increases red channel when overall intensity is small)
            // evil math magic etc.
            abs = Math.sqrt(color.r * color.r + color.g * color.g + color.b * color.b) / 442.;
            color.r = parseInt(color.r + color.r * Math.pow((1 - abs), 1.5))
            if (color.r > 255) {
                color.r = 255;
            }
            // end evil math magic

            setGroupRGBById("3", color.r / 255, color.g / 255, color.b / 255, .6, 3.);
        }
    }
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ('lights_on_off' in changes) {
        chrome.storage.sync.get('lights_on_off', function (data) {
            setGroupState("3", {'on': data.lights_on_off});
        });
    }
});


/*
 CUSTOM LIGHTS API
 */

var IP = "131.159.198.85";
var url = "http://" + IP + "/api";
var API_KEY = "FA9119AFBC";

function get(query) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/" + API_KEY + "/" + query, false);
    xhttp.send();
    return xhttp.responseText;
}

function put(query, data) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url + "/" + API_KEY + "/" + query, false);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(data);
    return xhttp.responseText;
}

function getGroupId(groupName) {
    groups = JSON.parse(get("groups"));
    for (group in groups) {
        if (JSON.stringify(groups[group].name) == groupName) {
            return group
        }
    }
    return -1
}

function setGroupState(groupId, data) {
    return JSON.parse(put("/groups/" + groupId + "/action/", JSON.stringify(data)));
}

function setGroupHSVById(groupId, h, s, v) {
    console.log(groupId + ": " + JSON.stringify({'bri': v, 'hue': h, 'sat': s}));
    return JSON.parse(put("/groups/" + groupId + "/action/", JSON.stringify({'bri': v, 'hue': h, 'sat': s})));
}

function setGroupHSVByName(groupName, h, s, v) {
    return setGroupHSVById(getGroupId(groupName), h, s, v);
}

function setGroupStateByName(groupName, data) {
    return setGroupState(getGroupId(groupName), data);
}

function getAllGroups() {
    var group_names = []
    groups = JSON.parse(get("/groups/"));
    for (group in groups) {
        group_names = group_names.concat(group.name)
    }

    return group_names
}

// takes rgb values in [0, 1], outputs hsv in [0, 1]
// function rgb2hsv(r, g, b){
//     mmax  = Math.max(r, Math.max(g, b));
//     mmin  = Math.min(r, Math.min(g, b));
//     delta = mmax-mmin;
//     console.log(delta)
//     h = 0.;
//     s = 0.;
//     v = 0.;
//     if(delta!=0.){
//         if(mmax == r){
//             h = (g-b)/delta;
//         }else if(mmax == g){
//             h = (b-r)/delta+2;
//         }else if(mmax == b){
//             h = (r-b)/delta+4;
//         }    
//     }
//     
//     v = mmax
//     
//     s = (v==0.) ? 0. : delta/v
//     
//     hsv = {'h': Math.floor(Math.abs(h)), 's': Math.floor(Math.abs(s)), 'v': Math.floor(Math.abs(v))}
//     
//     return hsv
// }

// modified versions of https://gist.github.com/mjackson/5311256

function rgb2hsv(r, g, b) {
//   r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return {'h': h, 's': s, 'v': v};
}

function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


/*
 * these functions take rgb values and two more parameters.
 * These facilitate a nonlinear mapping for value and saturation
 * which may be more pleasing to the eye
 */
function setGroupRGBById(groupId, r, g, b, gamma, delta) {
    hsv = rgb2hsv(r, g, b);
    return setGroupHSVById(groupId, hsv.h * 65536, Math.pow(hsv.s, gamma) * 255, Math.pow(hsv.v, delta) * 255);
}

function setGroupRGBByName(groupName, r, g, b, gamma) {
    return setGroupRGBById(getGroupId(groupName), r * 65536, g * 255, b * 255);
}
