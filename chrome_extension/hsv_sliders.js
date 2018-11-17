let h_slider = document.getElementById('h_slider');
let s_slider = document.getElementById('s_slider');
let v_slider = document.getElementById('v_slider');

// h_slider.oninput = function() {setGroupHSVById("3", parseInt(h_slider.value), parseInt(s_slider.value), parseInt(v_slider.value))};
//  
// s_slider.oninput= function() {setGroupHSVById("3", parseInt(h_slider.value), parseInt(s_slider.value), parseInt(v_slider.value))};
//  
// v_slider.oninput= function() {setGroupHSVById("3", parseInt(h_slider.value), parseInt(s_slider.value), parseInt(v_slider.value))};

h_slider.onchange = function() {setGroupHSVById("3", parseInt(h_slider.value), parseInt(s_slider.value), parseInt(v_slider.value))};
 
s_slider.onchange = function() {setGroupHSVById("3", parseInt(h_slider.value), parseInt(s_slider.value), parseInt(v_slider.value))};
 
v_slider.onchange = function() {setGroupHSVById("3", parseInt(h_slider.value), parseInt(s_slider.value), parseInt(v_slider.value))};

