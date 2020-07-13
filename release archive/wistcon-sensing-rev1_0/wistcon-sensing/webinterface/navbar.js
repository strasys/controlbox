/**
 * Navbar Functions
 * 
 * Johannes Strasser
 * 01.02.2017
 * www.strasys.at
 * 
 */


$('#navbar').on('shown.bs.collapse', function () {
       $("#navbar_collapse_button_glyphicon").removeClass("glyphicon-option-vertical").addClass("glyphicon-remove");
    });

$('#navbar').on('hidden.bs.collapse', function () {
       $("#navbar_collapse_button_glyphicon").removeClass("glyphicon-remove").addClass("glyphicon-option-vertical");
    });

$("#navbar_function").on('click', function(){
	window.location.replace("/pool_function/poolfunctions.html");
});

$("#navbar_set").on('click', function(){
	window.location.replace("/set/set.html?ver=1");
});

$("#navbar_home").on('click', function(){
	window.location.replace("/index.html?ver=2");
});




