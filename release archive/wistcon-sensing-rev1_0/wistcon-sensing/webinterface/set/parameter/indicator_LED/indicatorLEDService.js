/**
 *indicatorLEDService JavaScript code
 * 
 * Johannes Strasser
 * 01.04.2018
 * www.strasys.at
 * 
 */
sortoutcache = new Date();


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
		setgetServer("post","../../../userLogStatus.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Log = JSON.parse(xhttp.responseText); 
			
				if (callback1){
				callback1(Log);
				}
			}
		});		
}
/*
 * This function set's and get's the status of the composer process.
 * If the composer script is running StatusComposerProcess = 1 else 0.
 * setget =  (g = get) / (s = set)
 * setrunstopStatus = (run = true) / (stop = false)
 */
function setgetStatusLEDservice(setget, setrunstopStatus, callback2){
		setgetServer("post","indicatorLEDservicehandler.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var setgetStatus = JSON.parse(xhttp.responseText); 

					if (callback2){
					callback2(setgetStatus);
					}
				}
			},"setgetLEDserviceStatus="+setget+"&setrunstopStatus="+setrunstopStatus);		
}

function setModeStatus(LEDServiceStatus){
	if(LEDServiceStatus.runstop == 1){
		document.getElementById("radioindicatorLEDServiceON").checked = true;
		document.getElementById("radioindicatorLEDServiceOFF").checked = false;
	}
	else if (LEDServiceStatus.runstop == 0){
		document.getElementById("radioindicatorLEDServiceON").checked = false;
		document.getElementById("radioindicatorLEDServiceOFF").checked = true;
	}
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
			refreshStatus();
		});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
 function loadNavbar(callback1){
			getStatusLogin(function(Log){
				if (Log.adminstatus)
				{
					$(document).ready(function(){
						$("#mainNavbar").load("/navbar.html?ver=2", function(){
							$("#navbarSet").addClass("active");
							$("#navbar_set span").toggleClass("nav_notactive nav_active");
							$("#navbarlogin").hide();
							$("#navbarSet").show();							
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
 /*
  * Refresh status of composer information's.
  */
 function refreshStatus(){
	 	setgetStatusLEDservice("g","", function(statusLED){
			setModeStatus(statusLED);
		});
		setTimeout(function(){refreshStatus()}, 20000);
	}
