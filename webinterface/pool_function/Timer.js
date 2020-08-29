/**
 * Set - Timer - HMI
 * 
 * 22.08.2020
 * Johannes Strasser
 * 
 * www.strasys.at
 */

var sortoutcache = new Date();
var offsetTime;
var overlappflag;
var arrOutputTimerall = new Array();

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
			/*
			LogData = [
					(getLogData.loginstatus),
					(getLogData.adminstatus)
			                          ];
			*/
				if (callback1){
				callback1(getLogData);
				}
			}
		},"getLogData=g");		
}

function getUTCtimestampfromString(strTimeDate){
	getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText); 
				callback(Data.UTCtimestamp);
			}
		},"getUTCTimstampfromString="+strTimeDate);		
		
}

//Display Outputs for which timer can be set.
function setTimerOutputs(callback){
	//read VDF.xml
	getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var z = getXMLData.getElementsByTagName("TimerControl");
			var x = getXMLData.getElementsByTagName("GPIOOUT");
			//Check if timer is already set
			var objOutputTimer = z[0].getElementsByTagName("OutputTimer");
			var unsetRadio;
			var colorSet;
			var arrOutputTimer = new Array();
			
			for (j=0;j<objOutputTimer.length;j++){
				arrOutputTimer = [];
				var OutputNo = objOutputTimer[j].getElementsByTagName("Number")[0].childNodes[0].nodeValue;
				var OutputName = x[OutputNo].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
				var operationMode = objOutputTimer[j].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue;
				
				
				//Check if TimerSetting node is set in File VDF.xml
				var TimerSet = false;
				if (objOutputTimer[j].getElementsByTagName("TimerSetting").length != 0){
					TimerSet = true;
				}
				
				 arrOutputTimer.push(OutputNo,OutputName,operationMode,TimerSet);
				/* arrOutputTimer
				 *	0: "3"
​					1: "Poolbeleuchtung"
​					2: "AUTO"
					3: true​
					4: "15:03"
					5: "17:05"
					6: "01:00"
				 */
				
				var objOutputSetting = objOutputTimer[j].getElementsByTagName("TimerSetting");
				for(k=0;k<objOutputSetting.length;k++){
					arrOutputTimer.push(objOutputSetting[k].getElementsByTagName("Start")[0].childNodes[0].nodeValue);
					arrOutputTimer.push(objOutputSetting[k].getElementsByTagName("Stop")[0].childNodes[0].nodeValue);
					arrOutputTimer.push(objOutputSetting[k].getElementsByTagName("Periode")[0].childNodes[0].nodeValue);
				}
				
				arrOutputTimerall.push(arrOutputTimer);
				if (TimerSet){
					unsetRadio = "disabled";
					colorSet = "color:grey;";
					
				} else {
					unsetRadio = "";
					colorSet = "";
				}
				$("#TimerSetforOutput").append(
					"<div class='radio "+unsetRadio+"'>"+
						"<label style='margin-top: -5px; margin-left: 0px;margin-bottom: 10px; font-size: 150%; "+colorSet+"'>"+
							"<input id=\"radioOutput"+j+"\" type=\"radio\" name=\"radioOutputs\" value=\""+OutputNo+"\" "+unsetRadio+" >"+
							OutputName+
						"</label>"+
					"</div>"
				);	
			}
			$("#TimerSetforOutput").append(
				"<button id='buttonSetInterval' type='button' class='btn btn-default'>Zeitintervall für Auswahl erstellen</button>"
			);
		}
		
			
	if (callback){
		callback();
	}
	});
}

function displaySetTimer(callback){
	/* arrOutputTimer
		*	0: "3"
​			1: "Poolbeleuchtung"
​			2: "AUTO"
			3: true​
			4: "15:03"
			5: "17:05"
			6: "01:00"
	*/

	for (i=0;i<arrOutputTimerall.length;i++){
		var OutputNumber = arrOutputTimerall[i][0];
		var OutputName = arrOutputTimerall[i][1];
		var OutputSetMode = arrOutputTimerall[i][2];
		var checkedOFF = "checked";
		var checkedON = "checked";
		if(OutputSetMode === "OFF"){
			checkedOFF = "checked";
			checkedON = "";
		} else {
			checkedOFF = "";
			checkedON = "checked";		
		}
		
		if(arrOutputTimerall[i][3]){
			$("#TimerSetTimeSingleOutput").after(
				"<div class='databox info' id='idTimerSetdatabox"+OutputNumber+"'>"+
					"<div class='page-header'>"+
						"<h3><strong>Timer für "+OutputName+"</strong></h3>"+
					"</div>"+
					"<div class='panel-body'>"+		
						"<div class='row'>"+
							"<div class='col-xs-12 col-sm-12 col-lg-12'>"+
								"<div class='radio'>"+
		 							"<label>"+
		      							"<input type='radio' name='Output"+OutputNumber+"' value='OFF' "+checkedOFF+">"+
										"<h4><strong>AUS</strong></h4>"+
		   							"</label>"+
								"</div>"+
								"<div class='radio'>"+
		 							"<label>"+
		      							"<input type='radio' name='Output"+OutputNumber+"' value='AUTO' "+checkedON+">"+
										"<h4><b>EIN</b></h4>"+
									"</label>"+
								"</div>"+
							"</div>"+
							"<div id='table"+OutputNumber+"'>"+
							"</div>"+
					"</div>"+		
				"</div>"+
				"</div>"
				);
				
					
				
				for(j=4;j<arrOutputTimerall[i].length;j=j+3){
					if(j === arrOutputTimerall[i].length-3){
						var addTimebutton = "<button id='buttonTimerAdd' class='btn btn-default' type='button' style='width:40px;' onclick='clearCleaningIntervalTimeXML(0,'ButtonCleanTimeClear1')'><span class='glyphicon glyphicon-plus'></span></button>";
					} else {
						var addTimebutton = "";
					}
					$("#table"+OutputNumber).append(
		    						"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Ein 1</span>"+
											"<select id='StartTime"+OutputNumber+""+(j-4)/3+"' class='form-control' onchange='calcCleanTime(0,'CleanTimeField1','CleanTimePeriode1','ButtonCleanTime1','StartTime1','StopTime1')'></select>"+
										"</div>"+
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Aus 1</span>"+
											"<select id='StopTime"+OutputNumber+""+(j-4)/3+"' class='form-control' onchange='calcCleanTime(0,'CleanTimeField1','CleanTimePeriode1','ButtonCleanTime1','StartTime1','StopTime1')'></select>"+
										"</div>"+
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:140px;' class = 'input-group'>"+
											"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit 1</span>"+
											"<span id='TimePeriode"+OutputNumber+""+(j-4)/3+"' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
										"</div>"+
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:140px;' class = 'button-group'>"+
											"<button id='buttonTimerRemove"+OutputNumber+""+(j-4)/3+"' class='btn btn-danger' style='width:40px; margin-right:40px;' type='button' onclick='setCleaningIntervalTimeXML(0,'StartTime1','StopTime1','ButtonCleanTime1')'><span class='glyphicon glyphicon-remove'></span></button>"+
											addTimebutton+		
										"</div>"+
								"</div>"
							);
							
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StopTime"+OutputNumber+""+(j-4)/3);
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StartTime"+OutputNumber+""+(j-4)/3);
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					
					$("#StartTime"+OutputNumber+""+(j-4)/3).val(arrOutputTimerall[i][j]);
					$("#StopTime"+OutputNumber+""+(j-4)/3).val(arrOutputTimerall[i][j+1]);
					$("#TimePeriode"+OutputNumber+""+(j-4)/3).text(arrOutputTimerall[i][j+2]);
				}


			}	
		}
	
	
	if (callback){
		callback();
	}
}

function loadlast(){

$("#buttonSetInterval").on("click", function(){
	//get information selected
   	var radioValueChecked = $("#TimerSetforOutput input[name='radioOutputs']:checked").val();

if(radioValueChecked != undefined){

	for (i=0;i<arrOutputTimerall.length;i++){
		if (radioValueChecked === arrOutputTimerall[i][0]){
			var OutputName = arrOutputTimerall[i][1];
			var OutputNumber = arrOutputTimerall[i][0];
			var OutputSetMode = arrOutputTimerall[i][2];
			break;
		}
	}
	var checkedOFF = "checked";
	var checkedON = "checked";
	if(OutputSetMode === "OFF"){
		checkedOFF = "checked";
		checkedON = "";
	} else {
		checkedOFF = "";
		checkedON = "checked";		
	}
	
	$("#TimerSetTimeSingleOutput").after(
		"<div class='databox info' id='idTimerSetdatabox"+OutputNumber+"'>"+
			"<div class='page-header'>"+
				"<h3><strong>Timer für "+OutputName+"</strong></h3>"+
			"</div>"+
			"<div class='panel-body'>"+		
				"<div class='row'>"+
					"<div class='col-xs-12 col-sm-12 col-lg-12'>"+
						"<div class='radio'>"+
 							"<label>"+
      							"<input type='radio' name='Output"+OutputNumber+"' value='OFF' "+checkedOFF+">"+
								"<h4><strong>AUS</strong></h4>"+
   							"</label>"+
						"</div>"+
						"<div class='radio'>"+
 							"<label>"+
      							"<input type='radio' name='Output"+OutputNumber+"' value='AUTO' "+checkedON+">"+
								"<h4><b>EIN</b></h4>"+
							"</label>"+
						"</div>"+
					"</div>"+
				"<div id='table"+OutputNumber+"'>"+
						
    						"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div id='divStartTime"+OutputNumber+"0' style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Ein 1</span>"+
									"<select id='StartTime"+OutputNumber+"0' class='form-control' onchange='checkNewTimeset(0, "+OutputNumber+")'></select>"+
								"</div>"+
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div id='divStopTime"+OutputNumber+"0'style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Aus 1</span>"+
									"<select id='StopTime"+OutputNumber+"0' class='form-control' onchange='checkNewTimeset(0, "+OutputNumber+")'></select>"+
								"</div>"+
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; padding-bottom:20px; max-width:140px;' class = 'input-group'>"+
									"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit 1</span>"+
									"<span id='TimePeriode"+OutputNumber+"0' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
								"</div>"+
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; padding-bottom:20px; max-width:140px;' class = 'button-group'>"+
									"<button id='buttonTimerRemove"+OutputNumber+"0' class='btn btn-danger' style='width:40px; margin-right:40px;' type='button' onclick='setCleaningIntervalTimeXML(0,'StartTime1','StopTime1','ButtonCleanTime1')'><span class='glyphicon glyphicon-remove'></span></button>"+
									"<button id='buttonTimerAdd"+OutputNumber+"' class='btn btn-default' type='button' style='width:40px;' onclick='clearCleaningIntervalTimeXML(0,'ButtonCleanTimeClear1')'><span class='glyphicon glyphicon-plus'></span></button>"+		
								"</div>"+
							"</div>"+
						"</div>"+
				"</div>"+
			"</div>"+
		"</div>"+		
	"</div>"
	);
	var startTime = "StartTime"+OutputNumber+"0";
	var stopTime = "StopTime"+OutputNumber+"0";
	$("#TimePeriode"+OutputNumber+"0").text("00:00");
	$("#buttonTimerRemove"+OutputNumber+"0").hide();
	$("#buttonTimerAdd"+OutputNumber).hide();
	$("#buttonTimerAdd"+OutputNumber).after(
		"<button id='buttonsetNewTimeperiode"+OutputNumber+"' class='btn btn-success' type='button' style='width:40px;' onclick='setNewTimperiod(0,"+OutputNumber+")' disabled><span class='glyphicon glyphicon-ok'></span></button>"		
	);
	/*
		$("#TimerSetforOutput input[value="+OutputNumber+"]").attr("checked", false);
	$("#TimerSetforOutput input[value="+OutputNumber+"]").attr("disabled", true);
	*/
	$("#TimerSetforOutput input[value="+OutputNumber+"]").remove();
	setSelectTime(startTime,function(){
		setSelectTime(stopTime,function(){
			
		});
	});
}
});

//Timer on Change

}

function checkNewTimeset(Number, OutputNumber){
	var StartTime = $("#StartTime"+OutputNumber+""+Number).val();
	var StopTime = $("#StopTime"+OutputNumber+""+Number).val();
	StartTime = Date.parse("1 1 2020 "+StartTime);
	StopTime = Date.parse("1 1 2020 "+StopTime);
	console.log(StartTime);
	console.log(StopTime);
	//finde Array for OutputNumber
	/* arrOutputTimer
		*	0: "3"
​			1: "Poolbeleuchtung"
​			2: "AUTO"
			3: true​
			4: "15:03"
			5: "17:05"
			6: "01:00"
	*/

	for(i=0;i<arrOutputTimerall.length;i++){
		if(arrOutputTimerall[i][0] == OutputNumber){
		var arrNum = i;
		}
	}

	var startFlag = false;
	var stopFlag = false;
	if(arrOutputTimerall[arrNum].length > 6 ){
		console.log(getUTCtimestampfromString(arrOutputTimerall[arrNum][4]));	
	//check if Starttime is between already set times
	/*	for(i=0;i<arrOutputTimerall[arrNum].length;i++){
		
		}
	*/
	} else {
		startFlag = true;
		if(StopTime > StartTime){
		stopFlag = true;
		}
	}
	
		switch(startFlag){
			case true:
				$("#divStartTime"+OutputNumber+""+Number).removeClass("has-error");
				$("#divStartTime"+OutputNumber+""+Number).addClass("has-success");
				break;
			case false:
				$("#divStartTime"+OutputNumber+""+Number).addClass("has-success");
				$("#divStartTime"+OutputNumber+""+Number).removeClass("has-error");
		}

		switch(stopFlag){
			case true:
				$("#divStopTime"+OutputNumber+""+Number).removeClass("has-error");
				$("#divStopTime"+OutputNumber+""+Number).addClass("has-success");
				break;
			case false:
				$("#divStopTime"+OutputNumber+""+Number).removeClass("has-success");
				$("#divStopTime"+OutputNumber+""+Number).addClass("has-error");
		}

	
	if (startFlag && stopFlag){
		var timePeriode = StopTime - StartTime;
		var hours = Math.floor(timePeriode / 3600000);
		var minutes = "0"+(timePeriode - hours*3600000)/60000;

		$("#buttonsetNewTimeperiode"+OutputNumber).attr("disabled", false);
		$("#TimePeriode"+OutputNumber+""+Number).text(hours+":"+minutes.substr(-2));
	} else {
		$("#buttonsetNewTimeperiode"+OutputNumber).attr("disabled", true);
	}
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

function setTimerModeXML(radioID){
	var TimerMode = document.getElementById(radioID).value;		
		getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{		
		//	setTimeout(getSetXMLData(),100);
			}
		},
		"TimerMode="+TimerMode+
		"&setTimerMode=s");
	
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


function setSelectTime(idName,callback){
	for(i=0;i<24;i++){
		for(x=0;x<60;x=x+5){
			var y = document.getElementById(idName);
			var option1 = document.createElement("option");
			option1.text = ("0"+i).slice(-2)+":"+("0"+x).slice(-2);
			y.options.add(option1);
		}
	}
	if (callback){
		callback();
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

function calcTimer(interval,CleanTimeField,CleanTimePeriode,CleanTimeButton,StartTime,StopTime){
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

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		setTimerOutputs(function(){
			displaySetTimer(function(){
				loadlast();
			});
		});	
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getloginstatus(function(log){
		if (log.loginstatus)
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarFunction").addClass("active");
					$("#navbar_function span").toggleClass("nav_notactive nav_active")
					$("#navbarlogin").hide();
					$("#navbarSet").show();
					$("#inputhh").prop("disabled", true);
					$("#showSetTime").show();
					
					if (log.loginstatus == false)
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