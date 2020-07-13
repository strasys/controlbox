/**
 * Program to update the AIn values.
 * 
 * 22.07.2017
 * Johannes Strasser
 * 
 * www.wistcon.at
 */

sortoutcache = new Date();

function setgetServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

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

function getAINXMLData(callback){
	setgetServer("GET", "/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getAINXML = xhttp.responseXML;
				var w = getAINXML.getElementsByTagName("AINName");
				var z = w.length;
				var i = 0;
				for (i=0; i<z; i++){
				document.getElementById("labelAIN"+i).innerHTML=w[i].childNodes[0].nodeValue;	
				}
				if (callback){
					callback();
				}
			}
	});
	
}

function getXMLDataInput(callback){
	setgetServer("GET", "/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getAINXML = xhttp.responseXML;
				var w = getAINXML.getElementsByTagName("AINName");
				var z = w.length;
				var i = 0;
				for (i=0; i<z; i++){
				document.getElementById("changeAINName"+i).value=w[i].childNodes[0].nodeValue;	
				}
				if (callback){
					callback();
				}
			}
	});	
}

function getAIn(callback1){
		setgetServer("post","AIN.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var getAIn = JSON.parse(xhttp.responseText); 
				
				AnalogIN = [	(getAIn.INvalue1),
						(getAIn.INvalue2),
						(getAIn.INvalue3),
						(getAIn.INvalue4),
				           	(getAIn.loginstatus),
				            	(getAIn.adminstatus)
				               ];
					if (callback1){
						callback1();
					}
				}
			},"getAnalogVal=g");		
}

function showAINvalues(){
	
	getAIn(function(){
		$("#badgeAIN0").text(AnalogIN[0]);
		$("#badgeAIN1").text(AnalogIN[1]);
		$("#badgeAIN2").text(AnalogIN[2]);	
		$("#badgeAIN3").text(AnalogIN[3]);	
	});
	
	setTimeout(function(){showAINvalues()}, 10000);
}

// After pressing the button "Änderungen speichern" in the button name change menue.
// This function transfers the data to the server where it will be saved with the 
// help of a php function.
function setAINXMLDataInput(callback3){
	
	var AINText = [];
	
	for (i=0;i<4;i++){
		AINText[i] = document.getElementById("changeAINName"+i).value;
	}	
		
		setgetServer("post","AIN.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				callback3();
			}
		},
		"AINText0="+AINText[0]+
		"&AINText1="+AINText[1]+
		"&AINText2="+AINText[2]+
		"&AINText3="+AINText[3]+
		"&setTextFlag=1");
	
//	ButtonNameSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}

//Show input fields to change Button Names
function SetAINName(){
	 $(document).ready(function(){
		$("#setAINNameDiv").load("setAINName.html?ver=1", function(){
			getXMLDataInput(function(){
				$("#setAINNameDiv").show();
				$("#showSetAINName").hide();	
			});
		});
	 });
}

function SaveSetAINName(){
		  setAINXMLDataInput(function(){
				getAINXMLData();
		  });
}

function CancelSetAINName(){
		  getAINXMLDataInput();
}

function CollapseSetAINName(){
		$("#setAINNameDiv").hide();
		$("#showSetAINName").show();
		location.reload(true);
		 
}


//load functions at webpage opening
function startatLoad()
{
	loadNavbar(function()
	{
		getAINXMLData(function(){
			showAINvalues();
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system.
function loadNavbar(callback1)
{
	getStatusLogin(function()
	{
		if(Log[1])
		{
			$(document).ready(function()
			{
				$("#mainNavbar").load("/navbar.html?ver=2", function()
				{
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
	if (callback1)
	{
		callback1();
	}
	});
}
