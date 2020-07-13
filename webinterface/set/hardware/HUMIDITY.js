/**
 * Program to update the PT1000 values and
 * to set the wire length offset.
 * 
 * 20.07.2017
 * Johannes Strasser
 * 
 * www.wistcon.at
 */

sortoutcache = new Date();
//PT1000Num is to identify how mainy PT1000 cards are used in paralel
var HUMIDITYNum; 
//Is the number of the extension the card is put into.
var extNum;
//var getCookieData;

function getHUMIDITYData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

function getURLparms(callback){
	var parmURL = window.location.search.substring(1);
	vars = parmURL.split("&");
	//get extension Number 
	switch(vars[1]){
		case 'extension1':
			extNum = 1;
			break;
		case 'extension2':
			extNum = 2;
			break;
		case 'extension3':
			extNum = 3;
			break;
		case 'extension4':
			extNum = 4;
			break;
	}
		
	getCookie(vars[1], function(result){	
		if (result == 'HUMIDITY'){
			getCookie(vars[2], function(result1){
				HUMIDITYNum = result1;
				callback();
			});	
		} else {
			window.location.replace("hardware.html");
		}
	});		
}

function getStatusLogin(callback1){
		getHUMIDITYData("post","/userLogStatus.php",function()
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

function getHUMIDITYvalues(callback1){
		getHUMIDITYData("post","HUMIDITYhandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getHUMIDITY = JSON.parse(xhttp.responseText); 
			
				if (callback1){
					callback1(getHUMIDITY.humidity_val, getHUMIDITY.temperature_val, getHUMIDITY.loginstatus, getHUMIDITY.adminstatus);
				}
			}
		},"setgetHUMIDITYhandler=g"+
		  "&HUMIDITYext="+extNum);		
}

function getHUMIDITYXMLData(callback4){
	getHUMIDITYData("POST", "HUMIDITYhandler.php", function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getHUMIDITYXML = JSON.parse(xhttp.responseText);

			document.getElementById("labelHUMIDITY").innerHTML = getHUMIDITYXML[0];
			document.getElementById("labelTEMPERATURE").innerHTML = getHUMIDITYXML[1];

			if (callback4){
				callback4();
			}
		}		
	}, "getXMLData=1&HUMIDITYext="+HUMIDITYNum);
	
}

function showHUMIDITYvalues(){
	getHUMIDITYvalues(function(humidity, temperature, userLog_status, adminLog_status){
		if (userLog_status)
			{
				$("#badgeHUMIDITY").text(humidity+" % r.F.");
				$("#badgeTEMPERATURE").text(temperature+" °C");
			}
		else
			{
			window.location.replace("/login.html");
			}
	});
	setTimeout(function(){showHUMIDITYvalues()}, 10000);
}

// This function is called after pressing the "Button Beschriftung ändern" button.
// The function loads the actual button naming form the XML - file on the server
// into the input fields.

function getXMLDataInput(){
	getHUMIDITYData("GET", "/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getHUMIDITYXML = xhttp.responseXML;
				var w = getHUMIDITYXML.getElementsByTagName("HUMIDITYname"+HUMIDITYNum);
				var z = w.length;
				var i = 0;
				for (i=0; i<z; i++){
				document.getElementById("changeHUMIDITYName"+i).value=w[i].childNodes[0].nodeValue;	
				}
			}
	});
	
}


function getCookie(cname, callback) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
	if (c.indexOf(name) == 0) {
		return callback(c.substring(name.length, c.length));
	        }
    }
	return callback("");
}

// After pressing the button "Änderungen speichern" in the button name change menue.
// This function transfers the data to the server where it will be saved with the 
// help of a php function.
function setHUMIDITYXMLDataInput(callback3){
	
	var HUMIDITYText = [];
	
	for (i=0;i<2;i++){
		HUMIDITYText[i] = document.getElementById("changeHUMIDITYName"+i).value;
	}	
		
		getHUMIDITYData("post","HUMIDITYhandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				callback3();
			}
		},
		"HUMIDITYText0="+HUMIDITYText[0]+
		"&HUMIDITYText1="+HUMIDITYText[1]+
		"&HUMIDITYext=HUMIDITYname"+HUMIDITYNum+
		"&setHUMIDITYNameFlag=1");
	
//	ButtonNameSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}

//Show input fields to change Button Names
function SetHUMIDITYName(){
	 $(document).ready(function(){
		$("#setHUMIDITYNameDiv").load("setHUMIDITYName.html?ver=0", function(){
			getXMLDataInput();
			$("#setHUMIDITYNameDiv").show();
			$("#showSetHUMIDITYName").hide();	
		});
	 });
}

function SaveSetHUMIDITYName(){
		  setHUMIDITYXMLDataInput(function(){
				getHUMIDITYXMLData();
		  });
}

function CancelSetHUMIDITYName(){
		  getHUMIDITYXMLDataInput();
}

function CollapseSetHUMIDITYName(){
		$("#setHUMIDITYNameDiv").hide();
		$("#showSetHUMIDITYName").show();
		location.reload(true);
		 
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		getURLparms(function(extensionNum){
			getHUMIDITYXMLData(function(){
				showHUMIDITYvalues();
			});
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getStatusLogin(function(){
		if (Log[1])
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

