var IP = "131.159.198.85"
var url = "http://" + IP + "/api"
var API_KEY = "FA9119AFBC"



function get(query) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("response").innerHTML = xhttp.responseText;
        }
    };

    xhttp.open("GET", url + "/" + API_KEY + "/" + query, true);
    xhttp.send(); 
}

function getGroupId() {
    get("lights")
}