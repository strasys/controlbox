/**
 * Program to set the Solar heating system
 *   
 * 03.08.2016
 * Johannes Strasser
 * 
 * www.strasys.at
 */

var sortoutcache = new Date();

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getloginstatus(callback1){
		getData("post","SolarSetting.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getLogData = JSON.parse(xhttp.responseText); 
			
			LogData = [
					(getLogData.loginstatus),
					(getLogData.adminstatus)
			                          ];
				if (callback1){
				callback1();
				}
			}
		},"getLogData=g");		
}

function getXMLData(callback4){
	getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
	if (xhttp.readyState==4 && xhttp.status==200){
		var getXMLData = xhttp.responseXML;
		var w = getXMLData.getElementsByTagName("SolarSetting");
		var operationMode = w[0].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue;
		if(operationMode =='OFF'){
			document.getElementById("radioSolarOFF").checked = true;
			document.getElementById("radioSolarAUTO").checked = false;
		}
		if(operationMode =='AUTO'){
			document.getElementById("radioSolarAUTO").checked = true;
			document.getElementById("radioSolarOFF").checked = false;
		}
				
		document.getElementById("SolarBackWaterTemp").value = w[0].getElementsByTagName("backWaterTemp")[0].childNodes[0].nodeValue;
		document.getElementById("SolarDifferenceONTemp").value = w[0].getElementsByTagName("diffONTemp")[0].childNodes[0].nodeValue;
		document.getElementById("SolarDifferenceOFFTemp").value = w[0].getElementsByTagName("diffOFFTemp")[0].childNodes[0].nodeValue;
		document.getElementById("SolarSwitchOFFdelay").value = w[0].getElementsByTagName("SwitchOFFdelay")[0].childNodes[0].nodeValue;
		document.getElementById("SolarSwitchONdelay").value = w[0].getElementsByTagName("SwitchONdelay")[0].childNodes[0].nodeValue;


	}
	if (callback4){
		callback4();
	}
	});
}	

// Write cleaning interval time to XML - file.
function setSolarParameterXML(select,button,TempTyp){

	var TempValue = document.getElementById(select).value;		
	
		getData("post","SolarSetting.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				document.getElementById(button).setAttribute("class","btn btn-success");
				setTimeout(function(){document.getElementById(button).setAttribute("class","btn btn-default")},500);	
			}
		},
		"TempValue="+TempValue+
		"&TempTyp="+TempTyp);
}

function setSolarModeXML(radioID){
	var ModeStatus = document.getElementById(radioID).value;		
	
		getData("post","SolarSetting.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
					
			}
		},
		"TempValue="+ModeStatus+
		"&TempTyp=operationMode");
	//	setTimeout(function(){getXMLData()},3000);
}

function setSelectFieldsTemp(idName,StartTemp,StopTemp,interval){
	var x = 0;	
	for(x=StartTemp;x<=StopTemp;x=x+interval){
		var y = document.getElementById(idName);
		var option1 = document.createElement("option");
		option1.text = x;
		y.options.add(option1);
	}
}

function setSelectMenuesValues(callback5){
	setSelectFieldsTemp("SolarBackWaterTemp",18,36,1);
	setSelectFieldsTemp("SolarDifferenceONTemp",1,12,1);
	setSelectFieldsTemp("SolarDifferenceOFFTemp",1,12,1);
	setSelectFieldsTemp("SolarSwitchOFFdelay",1,15,1);
	setSelectFieldsTemp("SolarSwitchONdelay",1,15,1);

	
	if (callback5){
		callback5();
	}
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		setSelectMenuesValues(function(){
				getXMLData(function(){
				});
			});
		});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getloginstatus(function(){
		if (LogData[0])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarFunction").addClass("active");
					$("#navbar_function span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#navbarSet").show();
					$("#inputhh").prop("disabled", true);
				
					
					if (LogData[1]==false)
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

