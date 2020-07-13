/*
 * Niveau Control    
 * 06.09.2016
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
		getData("post","NiveauControl.php",function()
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
		var w = getXMLData.getElementsByTagName("LevelControl");
		var operationMode = w[0].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue;
		if(operationMode =='OFF'){
			document.getElementById("radioNiveauOFF").checked = true;
			document.getElementById("radioNiveauAUTO").checked = false;
		}
		if(operationMode =='AUTO'){
			document.getElementById("radioNiveauAUTO").checked = true;
			document.getElementById("radioNiveauOFF").checked = false;
		}
				
		document.getElementById("Niveautime").value = w[0].getElementsByTagName("Overtraveltime")[0].childNodes[0].nodeValue;
		document.getElementById("NiveautimeSensorON").value = w[0].getElementsByTagName("SensorONTime")[0].childNodes[0].nodeValue;

	}
	if (callback4){
		callback4();
	}
	});
}	

// Write cleaning interval time to XML - file.
function setNiveauParameterXML(select,button,ValueTyp){

	var Value = document.getElementById(select).value;		
	
		getData("post","NiveauControl.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				document.getElementById(button).setAttribute("class","btn btn-success");
				setTimeout(function(){document.getElementById(button).setAttribute("class","btn btn-default")},500);
			}
		},
		"Value="+Value+
		"&ValueTyp="+ValueTyp);
}

function setNiveauModeXML(radioID){
	var ModeStatus = document.getElementById(radioID).value;		
	
		getData("post","NiveauControl.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
					
			}
		},
		"Value="+ModeStatus+
		"&ValueTyp=operationMode");
}

function setSelectFieldsTime(idName,StartTemp,StopTemp,interval){
	var x = 0;	
	for(x=StartTemp;x<=StopTemp;x=x+interval){
		var y = document.getElementById(idName);
		var option1 = document.createElement("option");
		option1.text = x;
		y.options.add(option1);
	}
}

function setSelectMenuesValues(callback5){
	setSelectFieldsTime("Niveautime",1,60,1);
	setSelectFieldsTime("NiveautimeSensorON",1,60,1);	
	
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

