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
var PT1000Num; 
//Is the number of the extension the card is put into.
var extNum;
//var getCookieData;

function getPT1000Data(setget, url, cfunc, senddata){
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
		if (result == 'PT1000'){
			getCookie(vars[2], function(result1){
				PT1000Num = result1;
				callback();
			});	
		} else {
			window.location.replace("hardware.html");
		}
	});		
}

function getStatusLogin(callback1){
		getPT1000Data("post","/userLogStatus.php",function()
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

function getPT1000values(callback1){
		getPT1000Data("post","PT1000handler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getPT1000 = JSON.parse(xhttp.responseText); 
			
			PT1000temperaturevalues = [
						(getPT1000.temperature11),
						(getPT1000.temperature12),
			                        (getPT1000.loginstatus),
						(getPT1000.adminstatus)
			                          ];
				if (callback1){
				callback1();
				}
			}
		},"setgetPT1000handler=g"+
		  "&PT1000ext="+extNum);		
}

function getPT1000XMLData(callback4){
	getPT1000Data("POST", "PT1000handler.php", function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getPT1000XML = JSON.parse(xhttp.responseText);
			for (i=0; i<2; i++){
				document.getElementById("labelPT1000"+i).innerHTML = getPT1000XML[i];
			}
			if (callback4){
				callback4();
			}
		}		
	}, "getXMLData=1&PT1000ext="+PT1000Num);
	
}

function showPT1000values(){
	getPT1000values(function(){
		if (PT1000temperaturevalues[2])
			{
			for(i=0;i<5;i++){
				$("#badgePT1000"+(i+1)).text(PT1000temperaturevalues[i]+" °C");
			}
			}
		else
			{
			window.location.replace("/login.html");
			}
	});
	setTimeout(function(){showPT1000values()}, 10000);
}

// This function is called after pressing the "Button Beschriftung ändern" button.
// The function loads the actual button naming form the XML - file on the server
// into the input fields.

function getXMLDataInput(){
	getPT1000Data("GET", "/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getPT1000XML = xhttp.responseXML;
				var w = getPT1000XML.getElementsByTagName("PT1000Name"+PT1000Num);
				var z = w.length;
				var i = 0;
				for (i=0; i<z; i++){
					document.getElementById("changePT1000Name"+i).value=w[i].childNodes[0].nodeValue;	
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
function setPT1000XMLDataInput(callback3){
	
	var PT1000Text = [];
	
	for (i=0;i<2;i++){
		PT1000Text[i] = document.getElementById("changePT1000Name"+i).value;
	}	
		
		getPT1000Data("post","PT1000handler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				callback3();
			}
		},
		"PT1000Text0="+PT1000Text[0]+
		"&PT1000Text1="+PT1000Text[1]+
		"&PT1000ext=PT1000Name"+PT1000Num+
		"&setPT1000NameFlag=1");
	
//	ButtonNameSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}

//Show input fields to change Button Names
function SetPT1000Name(){
	 $(document).ready(function(){
		$("#setPT1000NameDiv").load("setPT1000Name.html?ver=0", function(){
			getXMLDataInput();
			$("#setPT1000NameDiv").show();
			$("#showSetPT1000Name").hide();	
		});
	 });
}

function SaveSetPT1000Name(){
		  setPT1000XMLDataInput(function(){
				getPT1000XMLData();
		  });
}

function CancelSetPT1000Name(){
		  getPT1000XMLDataInput();
}

function CollapseSetPT1000Name(){
		$("#setPT1000NameDiv").hide();
		$("#showSetPT1000Name").show();
		location.reload(true);
		 
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		getURLparms(function(extensionNum){
			getPT1000XMLData(function(){
				showPT1000values();
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

