/**
 * Program to set the Solar heating system
 *   
 * 17.04.2017
 * Johannes Strasser
 * 
 * www.strasys.at
 */

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getloginstatus(callback1){
		getData("post","/userLogStatus.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getLogData = JSON.parse(xhttp.responseText); 
			
			Log = [
					(getLogData.loginstatus),
					(getLogData.adminstatus)
			                          ];
				if (callback1){
				callback1();
				}
			}
		},"getLogData=g");		
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getloginstatus(function(){
		if (Log[0])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=2", function(){
					$("#navbarFunction").addClass("active");
					$("#navbar_function span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();							
					if (Log[1] == false)
					{
						$("#navbarSet").hide();
						$("#navbar_set").hide();
					}
					});	
			});
		}
		else
		{
			window.location.replace("/login.html");
		}
		if (callback1){
			callback1();
		}
	});
}

$("#CleaningInterval").on('click', function(){
	window.location = "CleaningInterval.html?ver=0";
});

$("#SolarSetting").on('click', function(){
	window.location = "SolarSetting.html?ver=0";
});

$("#NiveauControl").on('click', function(){
	window.location = "NiveauControl.html?ver=0";
});
