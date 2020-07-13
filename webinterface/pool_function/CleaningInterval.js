/**
 * Program to set the Pool Process Parameters
 * 
 * 28.07.2016
 * Johannes Strasser
 * 
 * www.strasys.at
 */

var sortoutcache = new Date();
var TimeDifference;
var overlappflag;

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getloginstatus(callback1){
		getData("post","CleaningInterval.php",function()
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

function getSystemTimeDate(callback2){
	getData("post","/set/time_date/setgetTime.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getSystemTime = JSON.parse(xhttp.responseText); 
			
			timedevice = [
				(getSystemTime.Day),
				(getSystemTime.Month),
				(getSystemTime.Year),
				(getSystemTime.hh),
				(getSystemTime.mm),
				(getSystemTime.ss),
			];

				if (callback2){
				callback2();
				}
			}
		});
}

function calcoffsettime(callback3){
		getSystemTimeDate(function(){
		var clientTime = new Date();
		var deviceTime = new Date();
		deviceTime.setDate(parseInt(timedevice[0]));
		deviceTime.setMonth(parseInt(timedevice[1]));
		deviceTime.setYear(parseInt(timedevice[2]));
		deviceTime.setHours(parseInt(timedevice[3]));
		deviceTime.setMinutes(parseInt(timedevice[4]));
		deviceTime.setSeconds(parseInt(timedevice[5]));
		var device = deviceTime.getTime();
		var client = deviceTime.getTime();
		offsetTime = client - device;
		
		if(callback3){
			callback3();
		}
		});
}

function getSetXMLData(callback4){
	getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var w = getXMLData.getElementsByTagName("CleaningInterval");
			var z = getXMLData.getElementsByTagName("CleaningSetting");
			var operationMode = z[0].getElementsByTagName("OperationMode")[0].childNodes[0].nodeValue;
		
			if(operationMode =='OFF'){
			document.getElementById("radioFilterOFF").checked = true;
			document.getElementById("radioFilterAUTO").checked = false;
			}
			if(operationMode =='AUTO'){
			document.getElementById("radioFilterAUTO").checked = true;
			document.getElementById("radioFilterOFF").checked = false;
			}

			var z = w.length;
			var i=0;
			for (i=0; i<z; i++){
				j=i+1
				document.getElementById("StartTime"+j).value = w[i].getElementsByTagName("Start")[0].childNodes[0].nodeValue;
				document.getElementById("StopTime"+j).value = w[i].getElementsByTagName("Stop")[0].childNodes[0].nodeValue;
				document.getElementById("CleanTimePeriode"+j).innerHTML = w[i].getElementsByTagName("Periode")[0].childNodes[0].nodeValue;				
			}
			if (callback4){
				callback4();
			}

		}
		});
			
	}	
		


function DisplayTime(){
	var clientTime = new Date();
	clientTime.setTime(clientTime.getTime()-offsetTime);
	document.getElementById("curTime").innerHTML=clientTime.toLocaleTimeString();
	setTimeout(function(){DisplayTime()}, 1000);
}


// Write cleaning interval time to XML - file.
function setCleaningIntervalTimeXML(interval,start,stop,ButtonCleanTime){
	
	var CleanInterval = interval;
	var StartTime = document.getElementById(start).value;	
	var StopTime = document.getElementById(stop).value;
		calcTimePeriode(start,stop,function(){
		getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				document.getElementById(ButtonCleanTime).setAttribute("class","btn btn-success");
				setTimeout(function(){document.getElementById(ButtonCleanTime).setAttribute("class","btn btn-default")},500);	
			}
		},
		"CleanInterval="+CleanInterval+
		"&StartTime="+StartTime+
		"&StopTime="+StopTime+
		"&CleanIntervalPeriode="+TimeDifference+
		"&setCleanTime=s");
		});
}

// Set Cleaning interval time XML data to "00:00"!
function clearCleaningIntervalTimeXML(interval,ButtonCleanTimeClear){
	
	var CleanInterval = interval;
	var StartTime = "00:00";	
	var StopTime = "00:00";
	var TimeDifference = "00:00";
		getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				getSetXMLData(function(){
				document.getElementById(ButtonCleanTimeClear).setAttribute("class","btn btn-success");
				setTimeout(function(){document.getElementById(ButtonCleanTimeClear).setAttribute("class","btn btn-default")},500);					   
				});
			}
		},
		"CleanInterval="+CleanInterval+
		"&StartTime="+StartTime+
		"&StopTime="+StopTime+
		"&CleanIntervalPeriode="+TimeDifference+
		"&setCleanTime=s");
}

function setFilterModeXML(radioID){
	var FilterMode = document.getElementById(radioID).value;		
		getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{		
		//	setTimeout(getSetXMLData(),100);
			}
		},
		"FilterMode="+FilterMode+
		"&setFilterMode=s");
	
	}

//Workaround since span text can not be read with all browser
//
function calcTimePeriode(StartTime,StopTime,callback6){
	var gTimeStart = document.getElementById(StartTime);
	var gTimeStop = document.getElementById(StopTime);
	var StartTime = new Date();
	var StopTime = new Date();
	var strStart = gTimeStart.value;
	var strStop = gTimeStop.value;
	StartTime.setUTCHours(strStart.substr(0,2));
	StartTime.setUTCMinutes(strStart.substr(3,2));
	StartTime.setUTCSeconds(0);
	StopTime.setUTCHours(strStop.substr(0,2));
	StopTime.setUTCMinutes(strStop.substr(3,2));
	StopTime.setUTCSeconds(0);
	var elapsed = StopTime - StartTime;
	var difference = new Date(elapsed);
	var elapsedhh = difference.getUTCHours();
	var elapsedmm = difference.getUTCMinutes();	
	TimeDifference = ("0"+elapsedhh).slice(-2)+":"+("0"+elapsedmm).slice(-2);
	if (callback6){
	callback6();
	}
}


function setSelectTime(idName){
	for(i=0;i<24;i++){
		for(x=0;x<60;x=x+5){
			var y = document.getElementById(idName);
			var option1 = document.createElement("option");
			option1.text = ("0"+i).slice(-2)+":"+("0"+x).slice(-2);
			y.options.add(option1);
		}
	}
}

function setSelectMenuesValues(callback5){
	setSelectTime("StartTime1");
	setSelectTime("StopTime1");
	setSelectTime("StartTime2");
	setSelectTime("StopTime2");
	setSelectTime("StartTime3");
	setSelectTime("StopTime3");
	setSelectTime("StartTime4");
	setSelectTime("StopTime4");
	
		
	if (callback5){
		callback5();
	}
}

function checktimeoverlapp(interval,start,stop,callback7){
	var StartTimeOverlapp = new Date();
	var StopTimeOverlapp = new Date();
	StartTimeOverlapp.setUTCHours(start.substr(0,2));
	StartTimeOverlapp.setUTCMinutes(start.substr(3,2));
	StartTimeOverlapp.setUTCSeconds(0);
	StopTimeOverlapp.setUTCHours(stop.substr(0,2));
	StopTimeOverlapp.setUTCMinutes(stop.substr(3,2));
	StopTimeOverlapp.setUTCSeconds(0);
	
	var StartTimeCompare = new Date();
	var StopTimeCompare = new Date();

getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
	if (xhttp.readyState==4 && xhttp.status==200){
		var getXMLData = xhttp.responseXML;
		var w = getXMLData.getElementsByTagName("CleaningInterval");
		var z = w.length;
		var i=0;
		overlappflag = 0;
		for (i=0; i<z; i++){
			if(i!=interval){
				var StartCompare = w[i].getElementsByTagName("Start")[0].childNodes[0].nodeValue;
				var StopCompare = w[i].getElementsByTagName("Stop")[0].childNodes[0].nodeValue;
				StartTimeCompare.setUTCHours(StartCompare.substr(0,2));
				StartTimeCompare.setUTCMinutes(StopCompare.substr(3,2));
				StartTimeCompare.setUTCSeconds(0);
				StopTimeCompare.setUTCHours(StopCompare.substr(0,2));
				StopTimeCompare.setUTCMinutes(StartCompare.substr(3,2));
				StopTimeCompare.setUTCSeconds(0);
			//	document.getElementById("test0").innerHTML = StartTimeOverlapp<StartTimeCompare;
			//	document.getElementById("test1").innerHTML = StopTimeOverlapp<StartTimeCompare;
			//	document.getElementById("test2").innerHTML = StartTimeOverlapp>StartTimeCompare; 
			//	document.getElementById("test3").innerHTML = StopTimeOverlapp>StopTimeCompare;

				if(!((StartTimeOverlapp<StartTimeCompare && StopTimeOverlapp<StartTimeCompare) || (StartTimeOverlapp>StopTimeCompare && StopTimeOverlapp>StopTimeCompare))){
				overlappflag =  1;						
				}
			}								
		}
		if (callback7){
			callback7();
		}
	}
	});

}

function calcCleanTime(interval,CleanTimeField,CleanTimePeriode,CleanTimeButton,StartTime,StopTime){
	var gTimeStart = document.getElementById(StartTime);
	var gTimeStop = document.getElementById(StopTime);

	checktimeoverlapp(interval,gTimeStart.value,gTimeStop.value,function(){
		if(overlappflag == 0){
		document.getElementById(CleanTimeField).setAttribute("class", "row");
		document.getElementById(CleanTimeButton).setAttribute("class", "btn btn-default");
		var Laufzeit = document.getElementById(CleanTimePeriode);
		var StartTime = new Date();
		var StopTime = new Date();
		var strStart = gTimeStart.value;
		var strStop = gTimeStop.value;
		StartTime.setUTCHours(strStart.substr(0,2));
		StartTime.setUTCMinutes(strStart.substr(3,2));
		StartTime.setUTCSeconds(0);
		StopTime.setUTCHours(strStop.substr(0,2));
		StopTime.setUTCMinutes(strStop.substr(3,2));
		StopTime.setUTCSeconds(0);
		var elapsed = StopTime - StartTime;
		var difference = new Date(elapsed);
		var elapsedhh = difference.getUTCHours();
		var elapsedmm = difference.getUTCMinutes();
		Laufzeit.innerHTML = ("0"+elapsedhh).slice(-2)+":"+("0"+elapsedmm).slice(-2);
		}
		else {
			document.getElementById(CleanTimeField).setAttribute("class", "row has-error");
			document.getElementById(CleanTimeButton).setAttribute("class", "btn btn-default disabled");
		}	
	});
}


function showSetTime(){
	 $(document).ready(function(){
		 $("#setTimeDiv").load("/set/time_date/setTime.html?ver=0",function(){
		 	$("#setTimeDiv").show();
		 });
		 
	 });
 
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		setSelectMenuesValues(function(){
			calcoffsettime(function(){
				getSetXMLData(function(){
					DisplayTime();
				});
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
					$("#navbar_function span").toggleClass("nav_notactive nav_active")
					$("#navbarlogin").hide();
					$("#navbarSet").show();
					$("#inputhh").prop("disabled", true);
					$("#showSetTime").show();
					
					if (LogData[1]==false)
					{
						$("#navbarSet").hide();
						$("#showSetTime").hide();
						$("#navbar_set").hide();
					}
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

