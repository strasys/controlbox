/**
 * Program for start side sensorbox
 * 
 * Johannes Strasser
 * 25.09.2020
 * www.strasys.at
 * 
 */

sortoutcache = new Date();
var positionPanelCurrent;

function setgetrequestServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getStatusLogin(callback1){
	setgetrequestServer("post","/userLogStatus.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var Log = JSON.parse(xhttp.responseText); 
		
			if (callback1){
			callback1(Log.loginstatus, Log.adminstatus);
			}
		}
	});		
}


function getServerData(callback2){
	setgetrequestServer("post","/index.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var Data = JSON.parse(xhttp.responseText); 
			//Data => humidity1, humidity_temp1

			if (callback2){
			callback2(Data);
			}
		}
	});		
}

function displayStartHMI(){
	$("#panelhome").append(
		"<div class='row'>"+
  			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/watertemp_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-3 display-dynval'>100</h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 class='col-xs-5 display-name'>Becken</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/airtemp_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-3 display-dynval'>100</h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 class='col-xs-5 display-name'>Luft</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			 "<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/bulboff_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-10 display-button-name'>Pool Licht</h3>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/bulbon_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-10 display-button-name'>Außen Licht</h3>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='FilterInfo' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/filter_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUS</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Filter</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='SolarInfo' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/solar_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUTO</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Solar</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			 "<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='LevelControlInfo' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/levelcontrol_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUTO</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Nachspeisen</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='OperationModeInfo' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>MAN</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+	
		"</div>"
	);
	
$("#FilterInfo").click(function(){
	$("#panelhome").empty();
	displayFilterHMI();
});

$("#SolarInfo").click(function(){
	$("#panelhome").empty();
	displaySolarHMI();
});

$("#LevelControlInfo").click(function(){
	$("#panelhome").empty();
	displayNiveauControlHMI();
});

$("#OperationModeInfo").click(function(){
	$("#panelhome").empty();
	displayOperationModeHMI();
});
}

function displaySolarHMI(){
	$("#panelhome").append(
		"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/solar_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Solar</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>MAN</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/3wayvalve_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>heizen</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Mischer</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/waterpump_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>EIN</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Pumpe</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/backwatertemp_icon_200_200.png' style='width:50px; height:50px;'></h3>"+
						"<h3 class='col-xs-3 display-dynval'>100</h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 class='col-xs-5 display-name'>Rücklauf</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/solartemp_icon_200_200.png' style='width:50px; height:50px;'></h3>"+
						"<h3 class='col-xs-3 display-dynval'>100</h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 class='col-xs-5 display-name'>Solar</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"			
	);
}

function displayFilterHMI(){
	$("#panelhome").append(
	"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/filter_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Filter</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>MAN</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/waterpump_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUS</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Pumpe</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/rinsbackvalve_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUS</h3>"+
						"<h4 class='col-xs-5 display-state-name'>rückspülen</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"			
	);
}

function displayNiveauControlHMI(){
	$("#panelhome").append(
	"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/levelcontrol_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Nachspeisen</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>MAN</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/watertape_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>EIN</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Wasserventil</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info switch-off' style='border-radius:3px; min-width:100%;''>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/levelsensor_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>leer</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Sensor</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"
	);			
}

function displayOperationModeHMI(){
	$("#panelhome").append(
	"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/operationmode_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Betriebsart</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUTO</h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"	
	);
}




function getXMLData(callback4){
	var getXMLData;
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var HUMIDITY = getXMLData.getElementsByTagName("HUMIDITY");
			//var PT1000 = getXMLData.getElementsByTagName("PT1000");

			document.getElementById("labelFeuchte1").innerHTML = HUMIDITY[0].getElementsByTagName("HUMIDITYname1")[0].childNodes[0].nodeValue;
			document.getElementById("labelFeuchte_Temp1").innerHTML = HUMIDITY[1].getElementsByTagName("HUMIDITYname1")[0].childNodes[0].nodeValue;
			
		if (callback4){
			callback4();
			}
		}	
	});
}

function setValues(data, callback6){
	document.getElementById("badgeFeuchte1").innerHTML = data.humidity1+"% r.F.";
	document.getElementById("badgeFeuchte_Temp1").innerHTML = data.humidity_temp1+"°C";

	if (callback6){
		callback6();
	}
}

function refresh(){
	getServerData(function(data){
		setValues(data, function(){
			setTimeout(function(){
				refresh();
			}, 10000);
		});
	});
}


// load functions and webpage opening
function startatLoad(){	
	loadNavbar(function(){
		displayStartHMI();
/*		getXMLData(function(){
			getServerData(function(data){
				setValues(data, function(){
					refresh();
				});
			});
		});
*/
	});
}

window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback3){
	getStatusLogin(function(Log_user, Log_admin){
		if(Log_user){	
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarHome").addClass("active");
					$("#navbar_home span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					if (Log_admin==false)
					{
						$("#navbarSet").hide();
						$("#navbar_set").hide();
					}
					});
				 });
			}
		else
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarHome").addClass("active");
					$("#navbar_home span").toggleClass("nav_notactive nav_active");
					$("#navbarlogout").hide();
					$("#navbarFunction").hide();
					$("#navbar_function").hide();
					$("#navbarSet").hide();
					$("#navbar_set").hide();
					$("#navbarHelp").hide();
					$("#navbar_help").hide();
					$("#panelStatusOperation").hide();
					$("#panelStatusActuators").hide();
					$("#panelAdditionalFunctions").hide();
					$("#panelQuickView").show();
				});
			});

		}
		if (callback3){
			callback3();
		}
	});
}



