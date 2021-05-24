/**
 * Program to set the Pool Process Parameters
 * 
 * 15.08.2020
 * Johannes Strasser
 * 
 * www.strasys.at
 */

var sortoutcache = new Date();
var offsetTime;
var overlappflag;
var arrCleaningInterval = new Array();
var arrCleaningIntervaltemp = new Array();

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

//write Data after Change
function writeChangeData(StartTime,StopTime,timePeriode,Number,callback){
	getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&Number="+Number+"&ChangeTimeperiode='true'");
}

//wirte Data after Add
function writeAddData(StartTime,StopTime,timePeriode,Number,callback){
	getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&Number="+Number+"&AddTimeperiode='true'");
}

//delete Data after Add
function deleteData(StartTime,Number,callback){
	getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&Number="+Number+"&DeleteTimeperiode='true'");
}

//write Mode
function writeModeData(Mode,callback){
	getData("post","CleaningInterval.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Mode="+Mode+"&writeMode='true'");
}

//read Cleaning Timer Data from *.xml
function getCleaningTimerData(callback){
	//read VDF.xml
	getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var z = getXMLData.getElementsByTagName("CleaningSetting");
			//Check if timer is already set
			var objCleaningInterval = z[0].getElementsByTagName("CleaningInterval");
			var operationMode = z[0].getElementsByTagName("OperationMode")[0].childNodes[0].nodeValue;
				
				//Check if CleaningInterval node is set in File VDF.xml
				var CleaningIntervalSet = false;
				if (objCleaningInterval.length != 0){
					CleaningIntervalSet = true;
					for(k=0;k<objCleaningInterval.length;k++){
						arrCleaningInterval.push(objCleaningInterval[k].getElementsByTagName("Start")[0].childNodes[0].nodeValue);
						arrCleaningInterval.push(objCleaningInterval[k].getElementsByTagName("Stop")[0].childNodes[0].nodeValue);
						arrCleaningInterval.push(objCleaningInterval[k].getElementsByTagName("Periode")[0].childNodes[0].nodeValue);
					}
				}
				
				arrCleaningInterval.splice(0, 0, CleaningIntervalSet);
				arrCleaningInterval.splice(0, 0, operationMode);
				/* arrOutputTimer
​					0: "AUTO"
					1: true​
					2: "15:03"
					3: "17:05"
					4: "01:00"
				 */
				if (callback){
					callback();		
				}
		}
	});
}

function displaySetCleaningTimer(callback){
	/* arrOutputTimer
		*	​1: "AUTO"
			2: true​
			3: "15:03"
			4: "17:05"
			5: "01:00"
	*/
	var SetOperationMode = arrCleaningInterval[0];
	var boolCleaningIntervalSet = arrCleaningInterval[1];
	var checkedOFF = "checked";
	var checkedON = "checked";
	if(SetOperationMode === "OFF"){
		checkedOFF = "checked";
		checkedON = "";
	} else {
		checkedOFF = "";
		checkedON = "checked";		
	}
		
			$("#CleaningTimer").append(			
						"<div class='row'>"+
							"<div class='col-xs-12 col-sm-12 col-lg-12'>"+
								"<div class='radio'>"+
		 							"<label>"+
		      							"<input type='radio' name='radioModeCleaning' value='OFF' "+checkedOFF+">"+
										"<h4><strong>AUS</strong></h4>"+
		   							"</label>"+
								"</div>"+
								"<div class='radio'>"+
		 							"<label>"+
		      							"<input type='radio' name='radioModeCleaning' value='AUTO' "+checkedON+">"+
										"<h4><b>AUTO</b></h4>"+
									"</label>"+
								"</div>"+
							"</div>"+
							"<div id='tableCleaningInterval'>"+
							"</div>"+
					"</div>"
			);
		
		if(boolCleaningIntervalSet){		
			for(j=2;j<arrCleaningInterval.length;j=j+3){
					$("#tableCleaningInterval").append(
						"<div id='table_"+(j-2)/3+"'>"+
		    				"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div id='divStartTime"+(j-2)/3+"' style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Ein "+(1+(j-2)/3)+"</span>"+
									"<input id='StartTime"+(j-2)/3+"' type='time' class='form-control' onchange='checkNewTimeset("+(j-2)/3+")'></input>"+
								"</div>"+
							"</div>"+
							"<div id='divStopTime"+(j-2)/3+"' class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Aus "+(1+(j-2)/3)+"</span>"+
									"<input id='StopTime"+(j-2)/3+"' type='time' class='form-control' onchange='checkNewTimeset("+(j-2)/3+")'></input>"+
								"</div>"+ 
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'input-group'>"+
									"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit "+(1+(j-2)/3)+"</span>"+
									"<span id='TimePeriode"+(j-2)/3+"' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
								"</div>"+
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3' >"+
								"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'button-group'>"+
									"<button id='buttonTimerChange"+(j-2)/3+"' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='changeSelectedTimeinterval("+(j-2)/3+")'><span class='glyphicon glyphicon-pencil'></span></button>"+
									"<button id='buttonTimerRemove"+(j-2)/3+"' class='btn btn-danger' style='width:40px; margin-right:10px;' type='button' onclick='DeleteTimeperiode("+(j-2)/3+")'><span class='glyphicon glyphicon-remove'></span></button>"+										
									"<button id='buttonTimerAdd"+(j-2)/3+"' class='btn btn-default' type='button' style='width:40px;' onclick='addTimeperiode("+(j-2)/3+")'><span class='glyphicon glyphicon-plus'></span></button>"+		
								"</div>"+
							"</div>"+					
					"</div>"
				);
				/*			
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StopTime"+(j-2)/3);
							//var option1 = document.createElement("option");
							//option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							//y.options.add(option1);
							text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							
						}
					}
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StartTime"+(j-2)/3);
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					
				*/
					$("#StartTime"+(j-2)/3)
										.val(arrCleaningInterval[j])
										.prop("disabled", true)
					$("#StopTime"+(j-2)/3)
								.val(arrCleaningInterval[j+1])
								.prop("disabled", true)
					$("#TimePeriode"+(j-2)/3).text(arrCleaningInterval[j+2]);
			}
		} else {
			$("#tableCleaningInterval").append(
				"<div id='table_0'>"+
    				"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
						"<div id='divStartTime0' style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
							"<span class='input-group-addon'>Ein 1</span>"+
							"<input id='StartTime0' class='form-control' onchange='checkNewTimeset(0)'></input>"+
						"</div>"+
					"</div>"+
					"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
						"<div id='divStopTime0'style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
							"<span class='input-group-addon'>Aus 1</span>"+
							"<input id='StopTime0' class='form-control' onchange='checkNewTimeset(0)'></input>"+
						"</div>"+
					"</div>"+
					"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
						"<div style='padding-top:20px; padding-bottom:20px; max-width:140px;' class = 'input-group'>"+
							"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit 1</span>"+
							"<span id='TimePeriode0' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
						"</div>"+
					"</div>"+
					"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
						"<div style='padding-top:20px; padding-bottom:20px; max-width:140px;' class = 'button-group'>"+
							"<button id='buttonTimerChange0' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='changeSelectedTimeinterval(0)'><span class='glyphicon glyphicon-pencil'></span></button>"+
							"<button id='buttonTimerRemove0' class='btn btn-danger' style='width:40px; margin-right:10px;' type='button' onclick='DeleteTimeperiode(0)'><span class='glyphicon glyphicon-remove'></span></button>"+
							"<button id='buttonTimerAdd0' class='btn btn-default' type='button' style='width:40px;' onclick='addTimeperiode(0)'><span class='glyphicon glyphicon-plus'></span></button>"+		
						"</div>"+
					"</div>"+
				"</div>"
			);
			var startTime = "StartTime0";
			var stopTime = "StopTime0";
			$("#TimePeriode0").text("00:00");
			$("#buttonTimerRemove0").hide();
			$("#buttonTimerChange0").hide();
			$("#buttonTimerAdd0").hide();
			$("#buttonTimerAdd0").after(
				"<button id='buttonsetNewTimeperiode0' class='btn btn-success' type='button' style='width:40px; margin-right:10px;' onclick='setNewTimeperiode(0)' disabled><span class='glyphicon glyphicon-ok'></span></button>"	
			);
						
			setSelectTime(startTime,function(){
				setSelectTime(stopTime,function(){
				});
			});
		}
			if (callback){
				callback();
			}
}

function loadlast(){

//Timer on Change
$("input:radio").change(function(){
	var radioName = this.name;
	var radioValue = this.value;
	
	writeModeData(radioValue, function(Data){
		if(Data.write != "success"){
			if(radioValue === "OFF"){
				$("input:radio[name="+radioName+"][value=AUTO]").prop("checked", true);
			} else if(radioValue === "AUTO"){
				$("input:radio[name="+radioName+"][value=OFF]").prop("checked", true);
			}
		}
	});
});

}

function checkNewTimeset(Number, callback){
	var StartTime = $("#StartTime"+Number).val();
	var StopTime = $("#StopTime"+Number).val();
	
	StartTime = new Date(2020,0,1,StartTime.split(":")[0],StartTime.split(":")[1]).getTime()/1000;
	StopTime = new Date(2020,0,1,StopTime.split(":")[0],StopTime.split(":")[1]).getTime()/1000;
	
	//StartTime = Date.parse("1 1 2020 "+StartTime);
	//StopTime = Date.parse("1 1 2020 "+StopTime);
	
	//finde Array for OutputNumber
	/* arrOutputTimer
		*	0: "AUTO"
			1: true​
			2: "15:03"
			3: "17:05"
			4: "01:00"
	*/
	
	var startFlag = false;
	var stopFlag = false;
	
	var arrSize =  arrCleaningInterval.length;
	if( arrSize > 2 ){		
	//check if Starttime is between already set times
	//check Start Value
		var StartIndex = undefined;
		for (j=2;j<arrSize;j=j+3){
			//Finde between which Array Elements Start is positioned and if collapses with another
			var Startn = new Date(2020,0,1,arrCleaningInterval[j].split(":")[0],arrCleaningInterval[j].split(":")[1]).getTime()/1000;
			if(StartTime < Startn){
				//StartIndex = Array element (Start-Stop) is greater than StartTime
				StartIndex = j;
				break;
			}
		}
		
		//Rand Funktion 
		var firstStartTime = new Date(2020,0,1,arrCleaningInterval[2].split(":")[0],arrCleaningInterval[2].split(":")[1]).getTime()/1000;
		var lastStopTime = new Date(2020,0,1,arrCleaningInterval[arrSize-2].split(":")[0],arrCleaningInterval[arrSize-2].split(":")[1]).getTime()/1000;
		var lastStartTime = new Date(2020,0,1,arrCleaningInterval[arrSize-3].split(":")[0],arrCleaningInterval[arrSize-3].split(":")[1]).getTime()/1000;
		if (StartIndex == 2){
			if(firstStartTime > StartTime){
					startFlag = true;
				} else {
					startFlag = false;
				}
			if(lastStopTime < lastStartTime){
				if(StartTime > lastStopTime){
					startFlag = true;
				} else {
					startFlag = false;
				}
			}
		}
		
		if (StartIndex == undefined){
			if(lastStopTime < StartTime){
				startFlag = true;
			} else {
				startFlag = false;
			}
		}
		
		if (StartIndex > 2){
			var StopTimecomp = new Date(2020,0,1,arrCleaningInterval[StartIndex-2].split(":")[0],arrCleaningInterval[StartIndex-2].split(":")[1]).getTime()/1000;
			if(StartTime > StopTimecomp){
				startFlag = true;
			} else {
				startFlag = false;
			}
		}
		
//check stop
		if (startFlag){
			//Ausnahme z.B.: 23:00 bis 08:00
			if(StartIndex == undefined){
				if (StopTime < StartTime){
					if(firstStartTime > StopTime){
						stopFlag = true;
					}
				}
				if (StopTime > StartTime){
					stopFlag = true;
				}
			}
			
			if(StartIndex >= 2){
				var tempTime = new Date(2020,0,1,arrCleaningInterval[StartIndex].split(":")[0],arrCleaningInterval[StartIndex].split(":")[1]).getTime()/1000;
				if(StopTime > StartTime && StopTime < tempTime)
				 {
					stopFlag = true;
				}
			}		
		}
		
	} else {
		if (StartTime != StopTime){
			startFlag = true;
			stopFlag = true;	
		}
	}
		
		switch(startFlag){
			case true:
				$("#divStartTime"+Number).removeClass("has-error");
				$("#divStartTime"+Number).addClass("has-success");
				break;
			case false:
				$("#divStartTime"+Number).removeClass("has-success");
				$("#divStartTime"+Number).addClass("has-error");
		}

		switch(stopFlag){
			case true:
				$("#divStopTime"+Number).removeClass("has-error");
				$("#divStopTime"+Number).addClass("has-success");
				break;
			case false:
				$("#divStopTime"+Number).removeClass("has-success");
				$("#divStopTime"+Number).addClass("has-error");
		}


	if (startFlag && stopFlag){
		if (StartTime < StopTime){
			var timePeriode = StopTime - StartTime;
			var hours = Math.floor(timePeriode / 3600);
			var minutes = "0"+(timePeriode - hours*3600)/60;
		} else if(StopTime < StartTime){
			var time24_00 = new Date(2020,0,1,24,00).getTime()/1000;
			var time00_00 = new Date(2020,0,1,00,00).getTime()/1000;
			var timePeriodeto24 = time24_00 - StartTime;
			var timePeriodefrom00 = StopTime - time00_00;
			var timePeriode = timePeriodeto24 + timePeriodefrom00;
			var hours = Math.floor(timePeriode/3600);
			var minutes = "0"+(timePeriode - hours*3600)/60; 
		}

		$("#buttonsetNewTimeperiode"+Number).attr("disabled", false);
		$("#TimePeriode"+Number).text(hours+":"+minutes.substr(-2));
	} else {
		$("#buttonsetNewTimeperiode"+Number).attr("disabled", true);
	}
	
	if(callback){
		callback(startFlag, stopFlag);
	}
}

//change selected time interval
function changeSelectedTimeinterval(Number){
	$("#StartTime"+Number).prop("disabled", false);
	//document.getElementById("StartTime"+Number).style.cursor = "pointer";
	$("#StopTime"+Number).prop("disabled", false);
	//document.getElementById("StopTime"+Number).style.cursor = "pointer";
	//$("#test").html("StartTime = "+$("#StartTime"+Number).val()+" StopTime= "+$("#StopTime"+Number).val()+" Number= "+Number);
	$("#TimePeriode"+Number).prop("disabled", false);
	$("#buttonsetNewTimeperiode"+Number).hide();
	$("#buttonTimerChange"+Number).hide();
	$("#buttonTimerRemove"+Number).hide();
	$("#buttonTimerAdd"+Number).hide();
	$("#buttonTimerAdd"+Number).after(
		"<button id='buttonundo' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='undochange()'><span class='glyphicon glyphicon-remove'></span></button>"
	);
	$("#buttonTimerAdd"+Number).after(
		"<button id='buttonsetNewTimeperiode"+Number+"' class='btn btn-success' type='button' style='width:40px; margin-right:10px;' onclick='ChangeTimeperiode("+Number+")' disabled><span class='glyphicon glyphicon-ok'></span></button>"
	);
	//document.getElementById("buttonsetNewTimeperiode"+Number).style.cursor = "pointer"; 

	arrCleaningIntervaltemp = "";
	arrCleaningIntervaltemp = arrCleaningInterval;

		//remove number of elements from tmparr
		//NumberChange = 4+Number*3
		arrCleaningIntervaltemp.splice(2+Number*3,3);	
}

// Write new time Interval to XML - file.
function setNewTimeperiode(Number){
	//checkNewTimeset(Number, function(bool_startFlag, bool_stopFlag){
	//	if(bool_startFlag && bool_stopFlag){
			var StartTime = $("#StartTime"+Number).val();
			var StopTime = $("#StopTime"+Number).val();
			var timePeriode = $("#TimePeriode"+Number).text();
			getData("post","CleaningInterval.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var Data = JSON.parse(xhttp.responseText);
				
					if (Data.write == 'success'){
						$("#StartTime"+Number).prop("disabled", true);
						$("#StopTime"+Number).prop("disabled", true);
						$("#divStartTime"+Number).removeClass("has-success");
						$("#divStopTime"+Number).removeClass("has-success");
						$("#buttonsetNewTimeperiode"+Number).hide();
						$("#buttonundoNew").remove();
						$("#buttonTimerChange0").show();
						$("#buttonTimerRemove"+Number).show();
						$("#buttonTimerAdd"+Number).show();
					}
				}
			},"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&setNewTimeperiode='true'");
	//	}	
	//});	
}

function ChangeTimeperiode(Number){
	//$("#test").html("StartTime = "+$("#StartTime"+Number).val()+" StopTime= "+$("#StopTime"+Number).val()+" Number= "+Number);
//	checkNewTimeset(Number, function(bool_startFlag, bool_stopFlag){
		var StartTime = $("#StartTime"+Number).val();
		var StopTime = $("#StopTime"+Number).val();
		var timePeriode = $("#TimePeriode"+Number).text();
		
		//if(bool_startFlag && bool_stopFlag){
			
			writeChangeData(StartTime,StopTime,timePeriode,Number, function(Data){
				if (Data.write == 'success'){
					$("#StartTime"+Number).prop("disabled", true);
					$("#StopTime"+Number).prop("disabled", true);
					$("#divStartTime"+Number).removeClass("has-success");
					$("#divStopTime"+Number).removeClass("has-success");
					$("#buttonsetNewTimeperiode"+Number).hide();
					$("#buttonTimerChange"+Number).show();
					$("#buttonTimerRemove"+Number).show();
					$("#buttonTimerAdd"+Number).show();
					$("#tableCleaningInterval div").remove();
					updateTableafterChange();
					}
			});
//		}
//	});
}

function addTimeperiode(Number){
	$("#buttonTimerAdd"+Number).attr("disabled",true);
		$("#table_"+Number).after(
			"<div id='tablet'>"+
		    	"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
					"<div id='divStartTimet' style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
						"<span class='input-group-addon'>Ein</span>"+
						"<input id='StartTimet' class='form-control' type='time' onchange='checkNewTimeset(\"t\")'></input>"+
					"</div>"+
				"</div>"+
				"<div id='divStopTimet' class= 'col-xs-12 col-sm-3 col-lg-3'>"+
					"<div style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
						"<span class='input-group-addon'>Aus </span>"+
						"<input id='StopTimet' class='form-control' type='time' onchange='checkNewTimeset(\"t\")'></input>"+
					"</div>"+ 
				"</div>"+
				"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
					"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'input-group'>"+
						"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit</span>"+
						"<span id='TimePeriodet' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
					"</div>"+
				"</div>"+
				"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
					"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'button-group'>"+
						"<button id='buttonsetNewTimeperiodet' class='btn btn-success' type='button' style='width:40px; margin-right:10px;' onclick='SaveAddTimeperiode(\"t\")' disabled><span class='glyphicon glyphicon-ok'></span></button>"+
						"<button id='buttonundo' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='undochange()'><span class='glyphicon glyphicon-remove'></span></button>"+			
					"</div>"+
				"</div>"+
			"</div>"
		);
			/*				
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StopTimet");
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StartTimet");
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
			*/
}

//Save Timeperiode and refresh table
function SaveAddTimeperiode(Number){
	var StartTime = $("#StartTime"+Number).val();
	var StopTime = $("#StopTime"+Number).val();
	var timePeriode = $("#TimePeriode"+Number).text();
	
	writeAddData(StartTime,StopTime,timePeriode,Number, function(Data){
		if (Data.write == 'success'){
			$("#tableCleaningInterval div").remove();
			updateTableafterChange();
			}
	});	
}

//delete Timeperiode and refresh table
function DeleteTimeperiode(Number){
	var StartTime = $("#StartTime"+Number).val();
	
	deleteData(StartTime,Number, function(Data){
		if (Data.write == 'success'){
			if(Number != 0){
				$("#tableCleaningInterval div").remove();
				updateTableafterChange();	
			} else {
				location.reload();
			}
		}
	});		
}

//undo change or add operation before writting to xml
function undochange(){
	$("#tableCleaningInterval div").remove();
	updateTableafterChange();	
}

function undoNew(){
	location.reload();
}

function updateTableafterChange(){
	updateCleaningInterval(function(arrCleaningIntervaltemp){
						/* arrOutputTimer
						*​	1: "AUTO"
							2: true​
							3: "15:03"
							4: "17:05"
							5: "01:00"
						*/
					//	console.log("after write data = "+arrOutputTimerall);
						arrCleaningInterval = [];
						arrCleaningInterval = arrCleaningIntervaltemp;
			for(j=2;j<arrCleaningInterval.length;j=j+3){
					$("#tableCleaningInterval").append(
						"<div id='table_"+(j-2)/3+"'>"+
		    				"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div id='divStartTime"+(j-2)/3+"' style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Ein "+(1+(j-2)/3)+"</span>"+
									"<input id='StartTime"+(j-2)/3+"' type='time' class='form-control' onchange='checkNewTimeset("+(j-2)/3+")'></input>"+
								"</div>"+
							"</div>"+
							"<div id='divStopTime"+(j-2)/3+"' class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Aus "+(1+(j-2)/3)+"</span>"+
									"<input id='StopTime"+(j-2)/3+"' type='time' class='form-control' onchange='checkNewTimeset("+(j-2)/3+")'></input>"+
								"</div>"+ 
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'input-group'>"+
									"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit "+(1+(j-2)/3)+"</span>"+
									"<span id='TimePeriode"+(j-2)/3+"' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
								"</div>"+
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'button-group'>"+
									"<button id='buttonTimerChange"+(j-2)/3+"' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='changeSelectedTimeinterval("+(j-2)/3+")'><span class='glyphicon glyphicon-pencil'></span></button>"+
									"<button id='buttonTimerRemove"+(j-2)/3+"' class='btn btn-danger' style='width:40px; margin-right:10px;' type='button' onclick='DeleteTimeperiode("+(j-2)/3+")'><span class='glyphicon glyphicon-remove'></span></button>"+										
									"<button id='buttonTimerAdd"+(j-2)/3+"' class='btn btn-default' type='button' style='width:40px;' onclick='addTimeperiode("+(j-2)/3+")'><span class='glyphicon glyphicon-plus'></span></button>"+		
								"</div>"+
							"</div>"+					
					"</div>"
				);
				/*			
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StopTime"+(j-2)/3);
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StartTime"+(j-2)/3);
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					*/
					$("#StartTime"+(j-2)/3)
										.val(arrCleaningInterval[j])
										.prop("disabled", true)
					$("#StopTime"+(j-2)/3)
								.val(arrCleaningInterval[j+1])
								.prop("disabled", true)
					$("#TimePeriode"+(j-2)/3).text(arrCleaningInterval[j+2]);
			}								
		});
}

//update time after change
function updateCleaningInterval(callback){
	//read VDF.xml
	getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var z = getXMLData.getElementsByTagName("CleaningSetting");
			//Check if timer is already set
			var objCleaningInterval = z[0].getElementsByTagName("CleaningInterval");
			var operationMode = z[0].getElementsByTagName("OperationMode")[0].childNodes[0].nodeValue;
				arrCleaningIntervaltemp = [];
				//Check if CleaningInterval node is set in File VDF.xml
				var CleaningIntervalSet = false;
				if (objCleaningInterval.length != 0){
					CleaningIntervalSet = true;
					for(k=0;k<objCleaningInterval.length;k++){
						arrCleaningIntervaltemp.push(objCleaningInterval[k].getElementsByTagName("Start")[0].childNodes[0].nodeValue);
						arrCleaningIntervaltemp.push(objCleaningInterval[k].getElementsByTagName("Stop")[0].childNodes[0].nodeValue);
						arrCleaningIntervaltemp.push(objCleaningInterval[k].getElementsByTagName("Periode")[0].childNodes[0].nodeValue);
					}
				}
				
				arrCleaningIntervaltemp.splice(0, 0, CleaningIntervalSet);
				arrCleaningIntervaltemp.splice(0, 0, operationMode);
				/* arrOutputTimer
​					0: "AUTO"
					1: true​
					2: "15:03"
					3: "17:05"
					4: "01:00"
				 */
				if (callback){
					callback(arrCleaningIntervaltemp);		
				}
		}
	});
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

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		getCleaningTimerData(function(){
			displaySetCleaningTimer(function(){
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