/**
 * Program to set and get the status of
 * the Outputs
 * 
 * Johannes Strasser
 * www.strasys.at
 * 24.01.2015
 */

var OUT;

sortoutcache = new Date();
// send request to server and
// receive status of digital outputs

function getGPIOoutXMLDa(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getOutstatus(callback1){
	// if (!document.all && !document.getElementById)
	// return
		
		getGPIOoutXMLDa("post","setGPIO.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getOUT = JSON.parse(xhttp.responseText); 
							
				OUT = [
					parseInt(getOUT.OUT1),
					parseInt(getOUT.OUT2),
					parseInt(getOUT.OUT3),
					parseInt(getOUT.OUT4),
					parseInt(getOUT.OUT5),
					parseInt(getOUT.OUT6),
					parseInt(getOUT.OUT7),
					parseInt(getOUT.OUT8),
					parseInt(getOUT.OUT9),
					parseInt(getOUT.OUT10),
					parseInt(getOUT.OUT11),
					parseInt(getOUT.OUT12),
					getOUT.loginstatus,
					getOUT.adminstatus
				];

				if (callback1){
					callback1();
				}
			}
		}, "setgetGPIO=g&InOut=o");		
}


// Function is called by click of a GPIO button
// based on status 1 or 0 the value will be send to the server
// after that function getOutstatus() is called to check the result.
function setOutstatus(numOut){
//	if (!document.all && !document.getElementById)
//	return
	if(OUT[parseInt(numOut)] == 1){
		valOut = 0;
	}
	if(OUT[parseInt(numOut)] == 0) {
		valOut = 1;
	}
	getGPIOoutXMLDa("post","setGPIO.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
					{
					getOutstatus(function(){
						setButtonOut();
					});
					}
			},"setgetGPIO=s&GPIOnum="+numOut+"&GPIOvalue="+valOut);		
	}


// This function sets the color and status (ein / aus) 
// of the button.
function setButtonOut(){
	 
	for (i=0; i<12; i++){
		var status = OUT[i];
		if(status == 1){
			span = document.getElementById("badgeOut"+(i));
			span.textContent = "EIN";
			button = document.getElementById("buttonOut"+(i));
			button.getAttributeNode("class").value = "btn btn-success";
		}
		if(status == 0) {
			span = document.getElementById("badgeOut"+(i));
			span.textContent = "AUS";
			button = document.getElementById("buttonOut"+(i));
			button.getAttributeNode("class").value = "btn btn-danger";
		}
	}
}



// This function will be called once at start and after
// set of the button naming.
// The names of the button are stored in a XML file on the server.
function getGPIOoutXMLData(callback2){
	getGPIOoutXMLDa("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
					{
					var getGPIOoutXML = xhttp.responseXML;
					var w = getGPIOoutXML.getElementsByTagName("GPIOOUT");
					var z = getGPIOoutXML.getElementsByTagName("GPIOOUT").length;
					var i = 0;
				//	document.getElementById("test0").innerHTML=z;
					for (i=0; i<z; i++){
						document.getElementById("buttonOutText"+i).innerHTML=w[i].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;						}
					if (callback2){
						callback2();
					}
					
					}
			});		
}

// This function is called after pressing the "Button Beschriftung ändern" button.
// The function loads the actual button naming form the XML - file on the server
// into the input fields.

function getGPIOoutXMLDataInput(){
	getGPIOoutXMLDa("GET", "/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getGPIOoutXML = xhttp.responseXML;
				var w = getGPIOoutXML.getElementsByTagName("GPIOOUT");
				var z = getGPIOoutXML.getElementsByTagName("GPIOOUT").length;
				var i = 0;
				for (i=0; i<z; i++){
				document.getElementById("setButtonNameInputOut"+i).value=w[i].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;	
				}
			}
	});
	
}


// After pressing the button "Änderungen speichern" in the button name change menue.
// This function transfers the data to the server where it will be saved with the 
// help of a php function.
function setGPIOoutXMLDataInput(callback3){

	var ButtonText = "";
	var ButtonTextRequest = "";
		for (i=0; i<12; i++){
			ButtonText = document.getElementById("setButtonNameInputOut"+i).value;
			ButtonTextRequest = ButtonTextRequest+"ButtonText"+i+"="+ButtonText+"&";
		}
			
		getGPIOoutXMLDa("post","setGPIO.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				callback3();
			}
		},
		ButtonTextRequest+"ButtonFlag=1");
	
//	ButtonNameSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}

//Show input fields to change Button Names
function SetButtonName(){
	 $(document).ready(function(){
		$("#setButtonNameDiv").load("setButtonName.html?ver=4", function(){
			getGPIOoutXMLDataInput();
			$("#setButtonNameDiv").show();
			$("#showSetButtonName").hide();	
		});
	 });
}

function SaveSetButtonName(){
		  setGPIOoutXMLDataInput(function(){
				getGPIOoutXMLData();
		  });
}

function CancelSetButtonName(){
		  getGPIOoutXMLDataInput();
}

function CollapseSetButtonName(){
		$("#setButtonNameDiv").hide();
		$("#showSetButtonName").show();
		location.reload(true);
		 
}

// JQUERY functions.

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system.
function loadNavbar(callback1)
{
	getOutstatus(function()
	{
		if (OUT[13])
		{
			$(document).ready(function()
			{
				$("#mainNavbar").load("/navbar.html?ver=2", function()
				{
					$("#navbarSet").addClass("active");
					$("#navbar_set span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#showSetButtonName").show();
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

//load functions ad webpage opening
window.onload=function(){
	loadNavbar(function()
	{
		getGPIOoutXMLData(function(){
			setButtonOut();
		});
	});	
//	refreshStatus();
	}

// todo: Integrate refresh function 
/*
function refreshStatus(){
	getOutstatus(function(){
		getGPIOoutXMLData(function(){
			setButtonOut();
		});
	});
	setTimeout(function(){refreshStatus()}, 2000);
}

*/

