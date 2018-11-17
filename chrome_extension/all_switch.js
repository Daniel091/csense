let all_switch = document.getElementById('all_switch');
let checked_all = false;
all_switch.onclick = function () {
    checked_all = !checked_all;

    if (checked_all) {
        setGroupState("3", {'on':true});
    }else{
        setGroupState("3", {'on':false});
    }
};
