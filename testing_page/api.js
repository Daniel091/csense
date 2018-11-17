var IP = "131.159.198.85"
var url = "http://" + IP + "/api"
var API_KEY = "FA9119AFBC"



function get(query) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/" + API_KEY + "/" + query, false);
    xhttp.send(); 
    return xhttp.responseText;
}

function put(query, data){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url + "/" + API_KEY + "/" + query, false);
    xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhttp.send(data);
    return xhttp.responseText;
}

function getGroupId(groupName) {
    groups = JSON.parse(get("groups"));
    for(group in groups){
        if(JSON.stringify(groups[group].name) == groupName){
            return group
        }
    }
    return -1
}

function setGroupState(groupId, data){
    return JSON.parse(put(groupId+"/action/", JSON.stringify(data)));
}
