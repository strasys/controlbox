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
var arrOutputTimeralltemp = new Array();

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

function getloginstatus(callback1){
		getData("post","Timer.php",function()
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
function writeChangeData(StartTime,StopTime,timePeriode,OutputNumber,Number,callback){
	getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&OutputNo="+OutputNumber+"&Number="+Number+"&ChangeTimeperiode='true'");
}

//wirte Data after Add
function writeAddData(StartTime,StopTime,timePeriode,OutputNumber,Number,callback){
	getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&OutputNo="+OutputNumber+"&Number="+Number+"&AddTimeperiode='true'");
}

//delete Data after Add
function deleteData(StartTime,OutputNumber,Number,callback){
	getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&OutputNo="+OutputNumber+"&Number="+Number+"&DeleteTimeperiode='true'");
}

//write Mode
function writeModeData(OutputNumber,Mode,callback){
	getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			 

				if(callback){
					callback(Data);
				}
			}
		},"Mode="+Mode+"&OutputNo="+OutputNumber+"&writeMode='true'");
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
										"<h4><b>AUTO</b></h4>"+
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
					$("#table"+OutputNumber).append(
								"<div id='table"+OutputNumber+"_"+(j-4)/3+"'>"+
		    						"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div id='divStartTime"+OutputNumber+""+(j-4)/3+"' style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Ein "+(1+(j-4)/3)+"</span>"+
											"<input id='StartTime"+OutputNumber+""+(j-4)/3+"' class='form-control' type='time' onchange='checkNewTimeset("+(j-4)/3+", "+OutputNumber+")'></input>"+
										"</div>"+
									"</div>"+
									"<div id='divStopTime"+OutputNumber+""+(j-4)/3+"' class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Aus "+(1+(j-4)/3)+"</span>"+
											"<input id='StopTime"+OutputNumber+""+(j-4)/3+"' class='form-control' type='time' onchange='checkNewTimeset("+(j-4)/3+", "+OutputNumber+")'></input>"+
										"</div>"+ 
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit "+(1+(j-4)/3)+"</span>"+
											"<span id='TimePeriode"+OutputNumber+""+(j-4)/3+"' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
										"</div>"+
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'button-group'>"+
											"<button id='buttonTimerChange"+OutputNumber+""+(j-4)/3+"' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='changeSelectedTimeinterval("+OutputNumber+", "+(j-4)/3+")'><span class='glyphicon glyphicon-pencil'></span></button>"+
											"<button id='buttonTimerRemove"+OutputNumber+""+(j-4)/3+"' class='btn btn-danger' style='width:40px; margin-right:10px;' type='button' onclick='DeleteTimeperiode("+(j-4)/3+","+OutputNumber+")'><span class='glyphicon glyphicon-remove'></span></button>"+
											"<button id='buttonTimerAdd"+OutputNumber+""+(j-4)/3+"' class='btn btn-default' type='button' style='width:40px;' onclick='addTimeperiode("+(j-4)/3+","+OutputNumber+")'><span class='glyphicon glyphicon-plus'></span></button>"+		
										"</div>"+
								"</div>"+
							"</div>"
							);
	/*						
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
	*/				
					$("#StartTime"+OutputNumber+""+(j-4)/3)
														.val(arrOutputTimerall[i][j])
														.prop("disabled", true)
					$("#StopTime"+OutputNumber+""+(j-4)/3)
								.val(arrOutputTimerall[i][j+1])
								.prop("disabled", true)
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
								"<h4><b>AUTO</b></h4>"+
							"</label>"+
						"</div>"+
					"</div>"+
			"<div id='table"+OutputNumber+"'>"+
				"<div id='table"+OutputNumber+"_0'>"+
    						"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div id='divStartTime"+OutputNumber+"0' style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Ein 1</span>"+
									"<input id='StartTime"+OutputNumber+"0' class='form-control' type='time' onchange='checkNewTimeset(0, "+OutputNumber+")'></input>"+
								"</div>"+
							"</div>"+
							"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
								"<div id='divStopTime"+OutputNumber+"0'style='padding-top:20px; max-width:140px;' class = 'input-group'>"+
									"<span class='input-group-addon'>Aus 1</span>"+
									"<input id='StopTime"+OutputNumber+"0' class='form-control' type='time' onchange='checkNewTimeset(0, "+OutputNumber+")'></input>"+
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
									"<button id='buttonTimerChange"+OutputNumber+"0' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='changeSelectedTimeinterval("+OutputNumber+", 0)'><span class='glyphicon glyphicon-pencil'></span></button>"+
									"<button id='buttonTimerRemove"+OutputNumber+"0' class='btn btn-danger' style='width:40px; margin-right:10px;' type='button' onclick='DeleteTimeperiode(0,"+OutputNumber+")'><span class='glyphicon glyphicon-remove'></span></button>"+
									"<button id='buttonTimerAdd"+OutputNumber+"0' class='btn btn-default' type='button' style='width:40px;' onclick='addTimeperiode(0, "+OutputNumber+")'><span class='glyphicon glyphicon-plus'></span></button>"+		
								"</div>"+
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
	$("#buttonTimerChange"+OutputNumber+"0").hide();
	$("#buttonTimerAdd"+OutputNumber+"0").hide();
	$("#buttonTimerAdd"+OutputNumber+"0").after(
		"<button id='buttonsetNewTimeperiode"+OutputNumber+"0' class='btn btn-success' type='button' style='width:40px; margin-right:10px;' onclick='setNewTimeperiode(0,"+OutputNumber+")' disabled><span class='glyphicon glyphicon-ok'></span></button>"+
		"<button id='buttonundoNew' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='undoNew()'><span class='glyphicon glyphicon-remove'></span></button>"		
	);
	/*
		$("#TimerSetforOutput input[value="+OutputNumber+"]").attr("checked", false);
	$("#TimerSetforOutput input[value="+OutputNumber+"]").attr("disabled", true);
	*/
/*
	$("#TimerSetforOutput input[value="+OutputNumber+"]").remove();
	setSelectTime(startTime,function(){
		setSelectTime(stopTime,function(){
			
		});
	});
*/
}
});

//Timer on Change
$("input:radio").change(function(){
	var radioName = this.name;
	var radioValue = this.value;
	var radioNamelength = radioName.length;
	var OutputNumber = radioName.charAt(radioNamelength-1);
	
	writeModeData(OutputNumber,radioValue, function(Data){
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

function checkNewTimeset(Number, OutputNumber, callback){
var StartTime = $("#StartTime"+OutputNumber+""+Number).val();
	var StopTime = $("#StopTime"+OutputNumber+""+Number).val();
	
	StartTime = new Date(2020,0,1,StartTime.split(":")[0],StartTime.split(":")[1]).getTime()/1000;
	StopTime = new Date(2020,0,1,StopTime.split(":")[0],StopTime.split(":")[1]).getTime()/1000;
	
	//StartTime = Date.parse("1 1 2020 "+StartTime);
	//StopTime = Date.parse("1 1 2020 "+StopTime);
	
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
	
	var arrSize =  arrOutputTimerall[arrNum].length;
	if( arrSize > 4 ){		
	//check if Starttime is between already set times
	//check Start Value
		var StartIndex = undefined;
		for (j=4;j<arrSize;j=j+3){
			//Finde between which Array Elements Start is positioned and if collapses with another
			var Startn = new Date(2020,0,1,arrOutputTimerall[arrNum][j].split(":")[0],arrOutputTimerall[arrNum][j].split(":")[1]).getTime()/1000;
			if(StartTime < Startn){
				//StartIndex = Array element (Start-Stop) is greater than StartTime
				StartIndex = j;
				break;
			}
		}
		
		//Rand Funktion 
		var firstStartTime = new Date(2020,0,1,arrOutputTimerall[arrNum][4].split(":")[0],arrOutputTimerall[arrNum][4].split(":")[1]).getTime()/1000;
		var lastStopTime = new Date(2020,0,1,arrOutputTimerall[arrNum][arrSize-2].split(":")[0],arrOutputTimerall[arrNum][arrSize-2].split(":")[1]).getTime()/1000;
		var lastStartTime = new Date(2020,0,1,arrOutputTimerall[arrNum][arrSize-3].split(":")[0],arrOutputTimerall[arrNum][arrSize-3].split(":")[1]).getTime()/1000;
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
			var StopTimecomp = new Date(2020,0,1,arrOutputTimerall[StartIndex-2].split(":")[0],arrOutputTimerall[StartIndex-2].split(":")[1]).getTime()/1000;
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
			
			if(StartIndex >= 4){
				var tempTime = new Date(2020,0,1,arrOutputTimerall[StartIndex].split(":")[0],arrOutputTimerall[StartIndex].split(":")[1]).getTime()/1000;
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
				$("#divStartTime"+OutputNumber+""+Number).removeClass("has-error");
				$("#divStartTime"+OutputNumber+""+Number).addClass("has-success");
				break;
			case false:
				$("#divStartTime"+OutputNumber+""+Number).removeClass("has-success");
				$("#divStartTime"+OutputNumber+""+Number).addClass("has-error");
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

		$("#buttonsetNewTimeperiode"+OutputNumber+""+Number).attr("disabled", false);
		$("#TimePeriode"+OutputNumber+""+Number).text(hours+":"+minutes.substr(-2));
	} else {
		$("#buttonsetNewTimeperiode"+OutputNumber+""+Number).attr("disabled", true);
	}
	
	if(callback){
		callback(startFlag, stopFlag);
	}
}

//change selected time interval
function changeSelectedTimeinterval(OutputNumber, Number){
	$("#StartTime"+OutputNumber+""+Number).prop("disabled", false);
	$("#StopTime"+OutputNumber+""+Number).prop("disabled", false);
	$("#TimePeriode"+OutputNumber+Number).prop("disabled", false);
	$("#buttonsetNewTimeperiode"+OutputNumber+""+Number).hide();
	$("#buttonTimerChange"+OutputNumber+""+Number).hide();
	$("#buttonTimerRemove"+OutputNumber+""+Number).hide();
	$("#buttonTimerAdd"+OutputNumber+""+Number).hide();
	$("#buttonTimerAdd"+OutputNumber+""+Number).after(
		"<button id='buttonundo"+OutputNumber+"' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='undochange("+OutputNumber+")'><span class='glyphicon glyphicon-remove'></span></button>"
	);
	$("#buttonTimerAdd"+OutputNumber+""+Number).after(
		"<button id='buttonsetNewTimeperiode"+OutputNumber+""+Number+"' class='btn btn-success' type='button' style='width:40px; margin-right:10px;' onclick='ChangeTimeperiode("+Number+","+OutputNumber+")' disabled><span class='glyphicon glyphicon-ok'></span></button>"
	);


	arrOutputTimeralltemp = "";
	arrOutputTimeralltemp = arrOutputTimerall;
	for(i=0;i<arrOutputTimerall.length;i++){
		if(arrOutputTimerall[i][0] == OutputNumber){
			var IndexOut = i;
			break;
		}
	}
		//remove number of elements from tmparr
		//NumberChange = 4+Number*3
		arrOutputTimeralltemp[IndexOut].splice(4+Number*3,3);	
}

// Write new time Interval to XML - file.
function setNewTimeperiode(Number,OutputNumber,callback){
	var StartTime = $("#StartTime"+OutputNumber+""+Number).val();
	var StopTime = $("#StopTime"+OutputNumber+""+Number).val();
	var timePeriode = $("#TimePeriode"+OutputNumber+Number).text();
	
	getData("post","Timer.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var Data = JSON.parse(xhttp.responseText);
			
				if (Data.write == 'success'){
					$("#StartTime"+OutputNumber+""+Number).prop("disabled", true);
					$("#StopTime"+OutputNumber+""+Number).prop("disabled", true);
					$("#divStartTime"+OutputNumber+""+Number).removeClass("has-success");
					$("#divStopTime"+OutputNumber+""+Number).removeClass("has-success");
					$("#buttonsetNewTimeperiode"+OutputNumber+""+Number).hide();
					$("#buttonundoNew").remove();
					$("#buttonTimerChange"+OutputNumber+"0").show();
					$("#buttonTimerRemove"+OutputNumber+""+Number).show();
					$("#buttonTimerAdd"+OutputNumber+""+Number).show();
				}
				if(callback){
					callback(Data);
				}
			}
		},"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&OutputNo="+OutputNumber+"&setNewTimeperiode='true'");		

}

function ChangeTimeperiode(Number, OutputNumber){
	var StartTime = $("#StartTime"+OutputNumber+""+Number).val();
	var StopTime = $("#StopTime"+OutputNumber+""+Number).val();
	var timePeriode = $("#TimePeriode"+OutputNumber+Number).text();
	
	writeChangeData(StartTime,StopTime,timePeriode,OutputNumber,Number, function(Data){
		if (Data.write == 'success'){
			$("#StartTime"+OutputNumber+""+Number).prop("disabled", true);
			$("#StopTime"+OutputNumber+""+Number).prop("disabled", true);
			$("#divStartTime"+OutputNumber+""+Number).removeClass("has-success");
			$("#divStopTime"+OutputNumber+""+Number).removeClass("has-success");
			$("#buttonsetNewTimeperiode"+OutputNumber+""+Number).hide();
			$("#buttonTimerChange"+OutputNumber+""+Number).show();
			$("#buttonTimerRemove"+OutputNumber+""+Number).show();
			$("#buttonTimerAdd"+OutputNumber+""+Number).show();
			$("#table"+OutputNumber+" div").remove();
			updateTableafterChange(OutputNumber);
			}
	});	
}

function addTimeperiode(Number, OutputNumber){
$("#buttonTimerAdd"+OutputNumber+""+Number).attr("disabled",true);
					$("#table"+OutputNumber+"_"+Number).after(
								"<div id='table"+OutputNumber+"t'>"+
		    						"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div id='divStartTime"+OutputNumber+"t' style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Ein</span>"+
											"<input id='StartTime"+OutputNumber+"t' class='form-control' type='time' onchange='checkNewTimeset(\"t\", "+OutputNumber+")'></input>"+
										"</div>"+
									"</div>"+
									"<div id='divStopTime"+OutputNumber+"t' class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Aus </span>"+
											"<input id='StopTime"+OutputNumber+"t' class='form-control' type='time' onchange='checkNewTimeset(\"t\", "+OutputNumber+")'></input>"+
										"</div>"+ 
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit</span>"+
											"<span id='TimePeriode"+OutputNumber+"t' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
										"</div>"+
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'button-group'>"+
											"<button id='buttonsetNewTimeperiode"+OutputNumber+"t' class='btn btn-success' type='button' style='width:40px; margin-right:10px;' onclick='SaveAddTimeperiode(\"t\","+OutputNumber+")' disabled><span class='glyphicon glyphicon-ok'></span></button>"+
											"<button id='buttonundo"+OutputNumber+"' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='undochange("+OutputNumber+")'><span class='glyphicon glyphicon-remove'></span></button>"+			
										"</div>"+
								"</div>"+
							"</div>"
							);
				/*			
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StopTime"+OutputNumber+"t");
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
					for(k=0;k<24;k++){
						for(x=0;x<60;x=x+5){
							var y = document.getElementById("StartTime"+OutputNumber+"t");
							var option1 = document.createElement("option");
							option1.text = ("0"+k).slice(-2)+":"+("0"+x).slice(-2);
							y.options.add(option1);
						}
					}
		*/		
}

//Save Timeperiode and refresh table
function SaveAddTimeperiode(Number, OutputNumber){
	var StartTime = $("#StartTime"+OutputNumber+""+Number).val();
	var StopTime = $("#StopTime"+OutputNumber+""+Number).val();
	var timePeriode = $("#TimePeriode"+OutputNumber+Number).text();
	
	writeAddData(StartTime,StopTime,timePeriode,OutputNumber,Number, function(Data){
		if (Data.write == 'success'){
			$("#table"+OutputNumber+" div").remove();
			updateTableafterChange(OutputNumber);
			}
	});	
}

//delete Timeperiode and refresh table
function DeleteTimeperiode(Number,OutputNumber){
	var StartTime = $("#StartTime"+OutputNumber+""+Number).val();
	
	deleteData(StartTime,OutputNumber,Number, function(Data){
		if (Data.write == 'success'){
			if(Number != 0){
				$("#table"+OutputNumber+" div").remove();
				updateTableafterChange(OutputNumber);	
			} else {
				location.reload();
			}
		}
	});		
}

//undo change or add operation before writting to xml
function undochange(OutputNumber){
	$("#table"+OutputNumber+" div").remove();
	updateTableafterChange(OutputNumber);	
}

function undoNew(){
	location.reload();
}

function updateTableafterChange(OutputNumber){
	updateOutputTimerall(function(arrOutputTimerTempall){
						/* arrOutputTimer
						*	0: "3"
			​				1: "Poolbeleuchtung"
​							2: "AUTO"
							3: true​
							4: "15:03"
							5: "17:05"
							6: "01:00"
						*/
					//	console.log("after write data = "+arrOutputTimerall);
						arrOutputTimerall = [];
						arrOutputTimerall = arrOutputTimerTempall;
						
						for(i=0;i<arrOutputTimerall.length;i++){
							if(arrOutputTimerall[i][0] == OutputNumber.toString()){
								var indexOut = i;
								
							}
						}
							
							for(j=4;j<arrOutputTimerall[indexOut].length;j=j+3){
								$("#table"+OutputNumber).append(
									"<div id='table"+OutputNumber+"_"+(j-4)/3+"'>"+
		    						"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div id='divStartTime"+OutputNumber+""+(j-4)/3+"' style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Ein "+(1+(j-4)/3)+"</span>"+
											"<select id='StartTime"+OutputNumber+""+(j-4)/3+"' class='form-control' onchange='checkNewTimeset("+(j-4)/3+", "+OutputNumber+")'></select>"+
										"</div>"+
									"</div>"+
									"<div id='divStopTime"+OutputNumber+""+(j-4)/3+"' class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon'>Aus "+(1+(j-4)/3)+"</span>"+
											"<select id='StopTime"+OutputNumber+""+(j-4)/3+"' class='form-control' onchange='checkNewTimeset("+(j-4)/3+", "+OutputNumber+")'></select>"+
										"</div>"+ 
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'input-group'>"+
											"<span class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'>Laufzeit "+(1+(j-4)/3)+"</span>"+
											"<span id='TimePeriode"+OutputNumber+""+(j-4)/3+"' class='input-group-addon' style='padding-top:9px; padding-bottom: 9px;'></span>"+
										"</div>"+
									"</div>"+
									"<div class= 'col-xs-12 col-sm-3 col-lg-3'>"+
										"<div style='padding-top:20px; padding-bottom:20px; max-width:160px;' class = 'button-group'>"+
											"<button id='buttonTimerChange"+OutputNumber+""+(j-4)/3+"' class='btn btn-default' type='button' style='width:40px; margin-right:10px;' onclick='changeSelectedTimeinterval("+OutputNumber+", "+(j-4)/3+")'><span class='glyphicon glyphicon-pencil'></span></button>"+
											"<button id='buttonTimerRemove"+OutputNumber+""+(j-4)/3+"' class='btn btn-danger' style='width:40px; margin-right:10px;' type='button' onclick='DeleteTimeperiode("+(j-4)/3+","+OutputNumber+")'><span class='glyphicon glyphicon-remove'></span></button>"+
											"<button id='buttonTimerAdd"+OutputNumber+""+(j-4)/3+"' class='btn btn-default' type='button' style='width:40px;' onclick='addTimeperiode("+(j-4)/3+","+OutputNumber+")'><span class='glyphicon glyphicon-plus'></span></button>"+		
										"</div>"+
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
					
					$("#StartTime"+OutputNumber+""+(j-4)/3)
														.val(arrOutputTimerall[indexOut][j])
														.prop("disabled", true)
					$("#StopTime"+OutputNumber+""+(j-4)/3)
								.val(arrOutputTimerall[indexOut][j+1])
								.prop("disabled", true)
					$("#TimePeriode"+OutputNumber+""+(j-4)/3).text(arrOutputTimerall[indexOut][j+2]);
				}
							
			});
}

//update time after change
function updateOutputTimerall(callback){
	//read VDF.xml

	getData("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var z = getXMLData.getElementsByTagName("TimerControl");
			var objOutputTimer = z[0].getElementsByTagName("OutputTimer");
			
			var arrOutputTimerTemp = [];
			var arrOutputTimerTempall = [];

			for (j=0;j<objOutputTimer.length;j++){
				arrOutputTimerTemp = [];
		//		var OutputNo = objOutputTimer[j].getElementsByTagName("Number")[0].childNodes[0].nodeValue;
		//		var operationMode = objOutputTimer[j].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue;
			
				arrOutputTimerTemp.push(arrOutputTimerall[j][0]);
				arrOutputTimerTemp.push(arrOutputTimerall[j][1]);
				arrOutputTimerTemp.push(arrOutputTimerall[j][2]);
				arrOutputTimerTemp.push(arrOutputTimerall[j][3]);
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
					arrOutputTimerTemp.push(objOutputSetting[k].getElementsByTagName("Start")[0].childNodes[0].nodeValue);
					arrOutputTimerTemp.push(objOutputSetting[k].getElementsByTagName("Stop")[0].childNodes[0].nodeValue);
					arrOutputTimerTemp.push(objOutputSetting[k].getElementsByTagName("Periode")[0].childNodes[0].nodeValue);
				}
				arrOutputTimerTempall[j] = arrOutputTimerTemp;

			}
				
					if (callback){
					callback(arrOutputTimerTempall);
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