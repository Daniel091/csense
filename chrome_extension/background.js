console.log('Popup js');
let changeColor = document.getElementById('changeColor');

// sets btn color to color from storage
chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

// sets green for everything
changeColor.onclick = function (ele) {
    console.log('Button Click');
    let color = ele.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        console.log(tabs);
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
};

let auto_switch = document.getElementById('auto_switch');
let checked = false;
auto_switch.onclick = function (ele) {
    console.log('Checkbox Click');
    checked = !checked;

    if (checked) {
        console.log('Checkbox Checked');
        get_color();
    }
};

function get_color() {
    chrome.tabs.captureVisibleTab(null, {quality: 50}, function (image) {
        console.log("Capture visible tap");

        let screen_con = document.getElementById('screen_con');
        screen_con.innerHTML = "<img src='" + image + "'/>";
    });
}