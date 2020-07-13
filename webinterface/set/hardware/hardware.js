/**
 *hardware JavaScript code
 * 
 * Johannes Strasser
 * 19.04.2017
 * www.strasys.at
 * 
 */
sortoutcache = new Date();
var EEPROMext;
/*
 * Asynchron server send function.
 */
function setgetServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}
/*
 * This function get's the login status.
 */

function getStatusLogin(callback1){
		setgetServer("post","/userLogStatus.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var LogStatus = JSON.parse(xhttp.responseText); 
			
			Log = [	(LogStatus.loginstatus),
				(LogStatus.adminstatus)
			               ];
				if (callback1){
				callback1();
				}
			}
		});		
}

function getExtensions(callback){
	setgetServer("post","hardware.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var ext = JSON.parse(xhttp.responseText); 
			EEPROMext = [ 	(ext[1]),
					(ext[3]),
					(ext[5]),
					(ext[7])	];
			
				if (callback){
				callback();
				}
			}
		});		
}

function setCookie(cname, cvalue, exdays, callback) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    if (callback){
	callback();
    }
}

function sethardwarehtmlinterface(callback){
	var a = 1;
	var counter_PT1000 = 0;
	var counter_AOUT = 0;
	var counter_AIN = 0;
	var counter_HUMIDITY = 0;
	for (i=0;i<4;i++){
		switch(EEPROMext[i]) {
			case "PT1000":
				counter_PT1000 += 1;
				idData = "PT1000"+counter_PT1000;
				header = "PT1000";
				description = "Übersicht der 2-Draht PT1000 Eingänge<br>Änderung Bezeichnung";
				loadExtensions(i+1, idData, header, description, function(){
				//set cookie
					setCookie("extension"+(i+1),"PT1000",1,function(){
						setCookie("extensionNumkind"+(i+1),counter_PT1000,1,function(){
						});
					});	
				});
				break;
			case "AOUT":
				counter_AOUT += 1;
				idData = "AOUT"+counter_AOUT;
				header = "Analoge Ausgänge";
				description = "Übersicht der Analogen Ausgänge<br>Änderung Bezeichnung";
				loadExtensions(i+1, idData, header, description, function(){
				//set cookie
					setCookie("extension"+(i+1),"AOUT",1,function(){
						setCookie("extensionNumkind"+(i+1),counter_AOUT,1,function(){
						});
					});	
				});
				break;
			case "AIN":
				counter_AIN += 1;
				idData = "AIN"+counter_AIN;
				header = "Analoge Eingänge";
				description = "Übersicht der Analogen Eingänge<br>Änderung Bezeichnung";
				loadExtensions(i+1, idData, header, description, function(){
				//set cookie
					setCookie("extension"+(i+1),"AIN",1,function(){
						setCookie("extensionNumkind"+(i+1),counter_AIN,1,function(){
						});
					});	
				});
				break;
			case "HUMIDITY":
				counter_HUMIDITY += 1;
				idData = "HUMIDITY"+counter_HUMIDITY;
				header = "Feuchte Sensor";
				description = "Feuchtesensor: Digital<br>Ausgabe: Feuchte und Temperatur";
				loadExtensions(i+1, idData, header, description, function(){
				//set cookie
					setCookie("extension"+(i+1),"HUMIDITY",1,function(){
						setCookie("extensionNumkind"+(i+1),counter_HUMIDITY,1,function(){
						});
					});	
				});
				break;
		}

	}
	
	if (callback){
		callback();
	}
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		getExtensions(function(){
			sethardwarehtmlinterface(function(){
				loadHardwareConfig();
			});
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
function loadNavbar(callback1){
			getStatusLogin(function(){
				if (Log[0])
				{
					$(document).ready(function(){
						$("#mainNavbar").load("/navbar.html?ver=2", function(){
							$("#navbarSet").addClass("active");
							$("#navbar_set span").toggleClass("nav_notactive nav_active")
							$("#navbarlogin").hide();
							
							if (Log[1]==false)
							{
								$("#navbarSet").hide();
								$("#navbar_set").hide();
							}
						});
					});
				}
				else
				{
					window.location.replace("/index.html");
				}
				if (callback1){
					callback1();
				}
			});
 }


$("#Extension1").on('click', function(){

	window.location = EEPROMext[0]+".html?ver=1&extension1&extensionNumkind1";
});
$("#Extension2").on('click', function(){

	window.location = EEPROMext[1]+".html?ver=0&extension2&extensionNumkind2";
});
$("#Extension3").on('click', function(){

	window.location = EEPROMext[2]+".html?ver=0&extension3&extensionNumkind3";
});
$("#Extension4").on('click', function(){

	window.location = EEPROMext[3]+".html?ver=1&extension4&extensionNumkind4";
});
$("#System").on('click', function(){

	window.location = "System.html?ver=1";
});


function loadExtensions(ExtensionNo, idData, header, description, callback){

	$("#Extension"+ExtensionNo).html("	<div id=\""+idData+"\" class=\"databox info btn btn-default\" style=\"border-radius:0px; min-width:100%;\">"+
				"<div class=\"page-header\">"+
					"<div class=\"row\">"+
						"<h3 class=\"col-xs-2 text-right\"><span class=\"glyphicon\" style=\"color:grey;\"></span></h3>"+
						"<h3 class=\"col-xs-8\" style=\"color:#0087e8;\">"+header+"</h3>"+
						"<h3 class=\"col-xs-2\"><span class=\"glyphicon glyphicon-chevron-right\" style=\"color:grey;\"></span></h3>"+
						"<h4 class=\"col-xs-12\">Erweiterungs-Modul "+ExtensionNo+"</h4>"+
					"</div>"+	
				"</div>"+
				"<div class=\"row\">"+
					"<p class=\"col-xs-12 col-md-12\">"+description+"</p>"+
				"</div>"+
				"</div>"
	);

	if (callback){
		callback();
	}
};

function loadHardwareConfig(callback){

	$("#System").html("	<div id=\"EEPROM\" class=\"databox info btn btn-default\" style=\"border-radius:0px; min-width:100%;\">"+
				"<div class=\"page-header\">"+
					"<div class=\"row\">"+
						"<h3 class=\"col-xs-2 text-right\"><span class=\"glyphicon\" style=\"color:grey;\"></span></h3>"+
						"<h3 class=\"col-xs-8\" style=\"color:#0087e8;\">System</h3>"+
						"<h3 class=\"col-xs-2\"><span class=\"glyphicon glyphicon-chevron-right\" style=\"color:grey;\"></span></h3>"+
						"<h4 class=\"col-xs-12\">EEPROM u. Betriebssystem</h4>"+
					"</div>"+	
				"</div>"+
				"<div class=\"row\">"+
					"<p class=\"col-xs-12 col-md-12\">Übersicht: Software- u. Hardware<br>Hardware, Firmware, Betriebssystem, etc.</p>"+
				"</div>"+
				"</div>"
	);

	if (callback){
		callback();
	}
};

