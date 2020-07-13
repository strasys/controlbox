/**
 * Program for start side sensorbox
 * 
 * Johannes Strasser
 * 11.03.2018
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
		getXMLData(function(){
			getServerData(function(data){
				setValues(data, function(){
					refresh();
				});
			});
		});
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



