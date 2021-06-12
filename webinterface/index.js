/**
 * Program for start side sensorbox
 * 
 * Johannes Strasser
 * 25.09.2020
 * www.strasys.at
 * 
 */

sortoutcache = new Date();
var positionPanelCurrent;

function setgetrequestServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getStatusLogin(callback1){
	setgetrequestServer("post","/userLogStatus.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var Log = JSON.parse(xhttp.responseText); 
		
			if (callback1){
			callback1(Log.loginstatus, Log.adminstatus);
			}
		}
	});		
}


function getServerData(callback2){
	setgetrequestServer("post","/index.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			ServerData = JSON.parse(xhttp.responseText); 
			/*
			'PoolTemp' => $PoolTemp,
			'AirTemp' => $AirTemp,
	    	'BackwaterTemp' => $BackwaterTemp,
	    	'SolarTemp' => $SolarTemp
			'GPIOin' => $GPIOin
			'GPIOout' => $GPIOout
			*/
			if (callback2){
			callback2();
			}
		}
	});		
}

function setServerData(buttontype, num, newstatus, callback){
		setgetrequestServer("post","/index_switches.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var setStatus = JSON.parse(xhttp.responseText); 
			ServerData.GPIOout[num] = setStatus;
			if (callback){
			callback(setStatus);
			}
		}
	},"ButtonType="+buttontype+"&newStatus="+newstatus+"&num="+num);
}

function displayStartHMI(callback){
	$("#panelhome").append(
		"<div class='row'>"+
  			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/watertemp_icon_200_200.png'></h3>"+
						"<h3 id='PoolTemp' class='col-xs-3 display-dynval'></h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 id='PoolTempName' class='col-xs-5 display-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/airtemp_icon_200_200.png'></h3>"+
						"<h3 id='AirTemp' class='col-xs-3 display-dynval'></h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 id='AirTempName' class='col-xs-5 display-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			 "<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='LightButton1' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img id='imgLightButton1' src='/images/bulboff_icon_200_200.png'></h3>"+
						"<h3 id='NameLightButton1' class='col-xs-10 display-button-name'></h3>"+
						"<div id='LightButton1Spiner'></div>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='LightButton2' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img id='imgLightButton2' src='/images/bulboff_icon_200_200.png'></h3>"+
						"<h3 id='NameLightButton2' class='col-xs-10 display-button-name'></h3>"+
						"<div id='LightButton2Spiner'></div>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInfo' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/filter_icon_200_200.png'></h3>"+
						"<h3 id='CleaningInfoStatus' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Filter</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='SolarInfo' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/solar_icon_200_200.png'></h3>"+
						"<h3 id='SolarInfoStatus' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Solar</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			 "<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='LevelInfo' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/levelcontrol_icon_200_200.png'></h3>"+
						"<h3 id='LevelInfoStatus' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Nachspeisen</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='OperationModeInfo' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 id='OperationModeInfoStatus' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+	
		"</div>"
	)
	.slideDown("");

$("#CleaningInfo").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			displayFilterHMI(function(){			
			});
		});
});

$("#SolarInfo").click(function(){
	$("#panelhome")
			.slideUp("slow", function(){
					$(this).empty();
					displaySolarHMI();
			});
});

$("#LevelInfo").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			displayNiveauControlHMI();
		});
});

$("#OperationModeInfo").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			displayOperationModeHMI();
		});
});


$(this)
	.ready($("#PoolTemp").text(ServerData.PoolTemp.toFixed(1)))
	.ready($("#AirTemp").text(ServerData.AirTemp.toFixed(1)))


$("#LightButton1").on("click", function(){
	$("#LightButton1Spiner").addClass("loadersmall pos-rel");
	if(ServerData.GPIOout[3] == '0'){
		var newstatus = '1';
	} else if (ServerData.GPIOout[3] == '1'){
		var newstatus = '0';
	}
	setServerData("DigiOutput", 3, newstatus, function(setStatus){
		setLightButtons(setStatus, "#LightButton1", "#imgLightButton1", function(){
			$("#LightButton1Spiner").removeClass("loadersmall pos-rel");
			if(StartHMITimeout === 'undefined'){
				refreshStartHMI();
			}
		});	
	});
});

$("#LightButton2").on("click", function(){
	$("#LightButton2Spiner").addClass("loadersmall pos-rel");
	if(ServerData.GPIOout[4] == '0'){
		var newstatus = '1';
	} else if (ServerData.GPIOout[4] == '1'){
		var newstatus = '0';
	}
	setServerData("DigiOutput", 4, newstatus, function(setStatus){
		setLightButtons(setStatus, "#LightButton2", "#imgLightButton2", function(){
			$("#LightButton2Spiner").removeClass("loadersmall pos-rel");
			if(StartHMITimeout === 'undefined'){
				refreshStartHMI();
			}
		});
	});
});

	if(callback){
		callback();
	}
}

function displaySolarHMI(){
	$("#panelhome").append(
		"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px; margin-top:20px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/solar_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Solar</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='SolarInfoHMIOperation' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 id='SolarInfoHMIStatusOperation' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='SolarInfoHMIMixer' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/3wayvalve_icon_200_200.png'></h3>"+
						"<h3 id='SolarInfoHMIMixerStatus' class='col-xs-5 display-state-val'>heizen</h3>"+
						"<h4 id='SolarInfoHMIMixerName' class='col-xs-5 display-state-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='SolarInfoHMIPump' class='databox info switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/waterpump_icon_200_200.png'></h3>"+
						"<h3 id='SolarInfoHMIPumpStatus' class='col-xs-5 display-state-val'>EIN</h3>"+
						"<h4 id='SolarInfoHMIPumpName' class='col-xs-5 display-state-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/backwatertemp_icon_200_200.png' style='width:50px; height:50px;'></h3>"+
						"<h3 id='BackwaterTemp' class='col-xs-3 display-dynval'></h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 id='BackWaterTempName' class='col-xs-5 display-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div class='databox info' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/solartemp_icon_200_200.png' style='width:50px; height:50px;'></h3>"+
						"<h3 id='SolarTemp' class='col-xs-3 display-dynval'></h3>"+
						"<h3 class='col-xs-2 display-dynval-unit'>°C</h3>"+
						"<h4 id='SolarTempName' class='col-xs-5 display-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"+
		"<div class='row' style='margin-top:40px;'>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='buttonBackHMI' class='databox info btn btn-default backbutton' >"+
					"<h4><span class='glyphicon glyphicon-menu-left' style='color:#999999;'></span></h4>"+
				"</div>"+
			"</div>"+
		"</div>"			
	)
	.slideDown("slow");

getXMLDataSolarHMI(function(){
	setDeviceButtons(ServerData.GPIOout[0], "#SolarInfoHMIPump", "#SolarInfoHMIPumpStatus", function(){
		setDeviceButtons(ServerData.GPIOout[1], "#SolarInfoHMIMixer", "#SolarInfoHMIMixerStatus", function(){
			$("#BackwaterTemp").text(ServerData.BackwaterTemp.toFixed(1));
			$("#SolarTemp").text(ServerData.SolarTemp.toFixed(1));
			clearInterval(StartHMITimeout);
			refreshSolarHMI();
		});
	});
});
	$("#buttonBackHMI").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			clearTimeout(SolarHMITimeout);
			displayStartHMI(function(){
				getXMLDataStartHMI(function(){
					setDataButtonsStartHMI(function(){
						refreshStartHMI();
					});
				});
			});
		});
});
	
$(this)
	.ready($("#BackwaterTemp").text(ServerData.BackwaterTemp.toFixed(1)))
	.ready($("#SolarTemp").text(ServerData.SolarTemp.toFixed(1)))

}

function displayFilterHMI(){
	$("#panelhome").append(
	"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px; margin-top:20px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/filter_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Filter</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInfoHMIOperation' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 id='CleaningInfoHMIStatusOperation' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInfoHMIPump' class='databox info switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/waterpump_icon_200_200.png'></h3>"+
						"<h3 id='CleaningInfoHMIPumpStatus' class='col-xs-5 display-state-val'></h3>"+
						"<h4 id='CleaningInfoHMIPumpName' class='col-xs-5 display-state-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='CleaningInterval' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/rinsbackvalve_icon_200_200.png'></h3>"+
						"<h3 class='col-xs-5 display-state-val'>AUS</h3>"+
						"<h4 class='col-xs-5 display-state-name'>rückspülen</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"+
		"<div class='row' style='margin-top:40px;'>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='buttonBackHMI' class='databox info btn btn-default backbutton' >"+
					"<h4><span class='glyphicon glyphicon-menu-left' style='color:#999999;'></span></h4>"+
				"</div>"+
			"</div>"+
		"</div>"			
	)
	.slideDown("slow");

getXMLDataCleaningHMI(function(){
	setDeviceButtons(ServerData.GPIOout[0], "#CleaningInfoHMIPump", "#CleaningInfoHMIPumpStatus", function(){
		clearInterval(StartHMITimeout);
			refreshFilterHMI();	
	});
});

$("#buttonBackHMI").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			clearTimeout(FilterHMITimeout);
			displayStartHMI(function(){
				getXMLDataStartHMI(function(){
					setDataButtonsStartHMI(function(){
						refreshStartHMI();
					});
				});
			});
		});
});
}

function displayNiveauControlHMI(){
	$("#panelhome").append(
	"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px; margin-top:20px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/levelcontrol_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Nachspeisen</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='NiveauControlHMIOperation' class='databox info btn btn-default switch-off' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 id='NiveauControlHMIStatusOperation' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='NiveauControlHMIWaterValve' class='databox info switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/watertape_icon_200_200.png'></h3>"+
						"<h3 id='NiveauControlHMIStatusWaterValve'class='col-xs-5 display-state-val'></h3>"+
						"<h4 id='NiveauControlHMIWaterValveName' class='col-xs-5 display-state-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='NiveauControlHMISensor' class='databox info switch-off' style='border-radius:3px; min-width:100%;''>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/levelsensor_icon_200_200.png'></h3>"+
						"<h3 id='NiveauControlHMIStatusSensor'class='col-xs-5 display-state-val'></h3>"+
						"<h4 id='NiveauControlHMISensorName' class='col-xs-5 display-state-name'></h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"+
		"<div class='row' style='margin-top:40px;'>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='buttonBackHMI' class='databox info btn btn-default backbutton' >"+
					"<h4><span class='glyphicon glyphicon-menu-left' style='color:#999999;'></span></h4>"+
				"</div>"+
			"</div>"+
		"</div>"
	)
	.slideDown("slow");
	
getXMLDataNiveauControlHMI(function(){
	clearInterval(StartHMITimeout);
	setDeviceButtons(ServerData.GPIOout[2], "#NiveauControlHMIWaterValve", "#NiveauControlHMIStatusWaterValve", function(){
		setDeviceInfolevel(ServerData.GPIOin[0], "#NiveauControlHMISensor", "#NiveauControlHMIStatusSensor", function(){
			refreshNiveauControlHMI();
		});	
	});
});
	
$("#buttonBackHMI").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			clearTimeout(NiveauControlHMITimeout);
			displayStartHMI(function(){
				getXMLDataStartHMI(function(){
					setDataButtonsStartHMI(function(){
						refreshStartHMI();
					});
				});
			});
		});
});			
}

function displayOperationModeHMI(){
	$("#panelhome").append(
	"<div class='row'>"+
		"<div class='page-header' style='margin-left:25px; margin-right:25px; margin-top:20px;'>"+
			"<h2 style='color:#0087e8;'><img src='/images/operationmode_icon_200_200.png' style='width:60px; height:60px; margin-right:35px;'><b> Betriebsart</b></h2>"+
		"</div>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='OperationModeHMI' class='databox info btn btn-default switch-on' style='border-radius:3px; min-width:100%;'>"+
					"<div class='row'>"+
						"<h3 class='col-xs-2 display-info'><img src='/images/operationmode_icon_200_200.png'></h3>"+
						"<h3 id='OperationModeHMIStatus' class='col-xs-5 display-state-val'></h3>"+
						"<h4 class='col-xs-5 display-state-name'>Betriebsart</h4>"+
					"</div>"+	
				"</div>"+
			"</div>"+
	"</div>"+
		"<div class='row' style='margin-top:40px;'>"+
			"<div class='col-md-6 col-sm-6 col-xs-12'>"+
				"<div id='buttonBackHMI' class='databox info btn btn-default backbutton' >"+
					"<h4><span class='glyphicon glyphicon-menu-left' style='color:#999999;'></span></h4>"+
				"</div>"+
			"</div>"+
		"</div>"	
	)
	.slideDown("slow");

getXMLDataOperationModeHMI(function(){
	clearInterval(StartHMITimeout);
	refreshOperationModeHMI();
});
	
$("#buttonBackHMI").click(function(){
	$("#panelhome")
		.slideUp("slow", function(){
			$(this).empty();
			clearTimeout(OperationModeHMITimeout);
			displayStartHMI(function(){
				getXMLDataStartHMI(function(){
					setDataButtonsStartHMI(function(){
						refreshStartHMI();
					});
				});
			});
		});
});
}

function getXMLDataStartHMI(callback4){
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			//var HUMIDITY = getXMLData.getElementsByTagName("HUMIDITY");
			var PT1000 = getXMLData.getElementsByTagName("PT1000");
			var OperationMode = getXMLData.getElementsByTagName("OperationModeDevice");
			var GPIOOUT = getXMLData.getElementsByTagName("GPIOOUT");
			//var GPIOUIN = getXMLData.getElementsByTagName("GPIOIN");
			var CleaningSetting = getXMLData.getElementsByTagName("CleaningSetting");
			var SolarSetting = getXMLData.getElementsByTagName("SolarSetting");
			var LevelControl = getXMLData.getElementsByTagName("LevelControl");
			//var TimerControl = getXMLData.getElementsByTagName("TimerControl");
			
			document.getElementById("PoolTempName").innerHTML = PT1000[0].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			document.getElementById("AirTempName").innerHTML = PT1000[1].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[2].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[3].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[2].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("NameLightButton1").innerHTML = GPIOOUT[3].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("NameLightButton2").innerHTML = GPIOOUT[4].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			
			setFunctionalButtons(CleaningSetting[0].getElementsByTagName("OperationMode")[0].childNodes[0].nodeValue, "#CleaningInfo", "#CleaningInfoStatus", function(){
				setFunctionalButtons(SolarSetting[0].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue, "#SolarInfo", "#SolarInfoStatus", function(){
					setFunctionalButtons(LevelControl[0].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue, "#LevelInfo", "#LevelInfoStatus", function(){
						setFunctionalButtons(OperationMode[0].getElementsByTagName("AutomaticHand")[0].childNodes[0].nodeValue, "#OperationModeInfo", "#OperationModeInfoStatus", function(){
						});
					});
				});
			});
		if (callback4){
			callback4();
			}
		}	
	});
}

function getXMLDataCleaningHMI(callback4){
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			//var HUMIDITY = getXMLData.getElementsByTagName("HUMIDITY");
			//var PT1000 = getXMLData.getElementsByTagName("PT1000");
			//var OperationMode = getXMLData.getElementsByTagName("OperationModeDevice");
			var GPIOOUT = getXMLData.getElementsByTagName("GPIOOUT");
			//var GPIOUIN = getXMLData.getElementsByTagName("GPIOIN");
			var CleaningSetting = getXMLData.getElementsByTagName("CleaningSetting");
			//var SolarSetting = getXMLData.getElementsByTagName("SolarSetting");
			//var LevelControl = getXMLData.getElementsByTagName("LevelControl");
			//var TimerControl = getXMLData.getElementsByTagName("TimerControl");
			
			//document.getElementById("PoolTempName").innerHTML = PT1000[0].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[1].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[2].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[3].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			document.getElementById("CleaningInfoHMIPumpName").innerHTML = GPIOOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[2].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[3].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton2").innerHTML = GPIOOUT[4].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			
			setFunctionalButtons(CleaningSetting[0].getElementsByTagName("OperationMode")[0].childNodes[0].nodeValue, "#CleaningInfoHMIOperation", "#CleaningInfoHMIStatusOperation", function(){
			});
		if (callback4){
			callback4();
			}
		}	
	});
}

function getXMLDataSolarHMI(callback4){
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			//var HUMIDITY = getXMLData.getElementsByTagName("HUMIDITY");
			var PT1000 = getXMLData.getElementsByTagName("PT1000");
			//var OperationMode = getXMLData.getElementsByTagName("OperationModeDevice");
			var GPIOOUT = getXMLData.getElementsByTagName("GPIOOUT");
			//var GPIOUIN = getXMLData.getElementsByTagName("GPIOIN");
			//var CleaningSetting = getXMLData.getElementsByTagName("CleaningSetting");
			var SolarSetting = getXMLData.getElementsByTagName("SolarSetting");
			//var LevelControl = getXMLData.getElementsByTagName("LevelControl");
			//var TimerControl = getXMLData.getElementsByTagName("TimerControl");
			
			//document.getElementById("PoolTempName").innerHTML = PT1000[0].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[1].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			document.getElementById("BackWaterTempName").innerHTML = PT1000[2].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			document.getElementById("SolarTempName").innerHTML = PT1000[3].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			document.getElementById("SolarInfoHMIPumpName").innerHTML = GPIOOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("SolarInfoHMIMixerName").innerHTML = GPIOOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[2].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton1").innerHTML = GPIOOUT[3].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton2").innerHTML = GPIOOUT[4].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			
			setFunctionalButtons(SolarSetting[0].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue, "#SolarInfoHMIOperation", "#SolarInfoHMIStatusOperation", function(){
			});
		if (callback4){
			callback4();
			}
		}	
	});
}

function getXMLDataNiveauControlHMI(callback4){
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			//var HUMIDITY = getXMLData.getElementsByTagName("HUMIDITY");
			//var PT1000 = getXMLData.getElementsByTagName("PT1000");
			//var OperationMode = getXMLData.getElementsByTagName("OperationModeDevice");
			var GPIOOUT = getXMLData.getElementsByTagName("GPIOOUT");
			var GPIOIN = getXMLData.getElementsByTagName("GPIOIN");
			//var CleaningSetting = getXMLData.getElementsByTagName("CleaningSetting");
			//var SolarSetting = getXMLData.getElementsByTagName("SolarSetting");
			var LevelControl = getXMLData.getElementsByTagName("LevelControl");
			//var TimerControl = getXMLData.getElementsByTagName("TimerControl");
			
			//document.getElementById("PoolTempName").innerHTML = PT1000[0].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[1].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("BackWaterTempName").innerHTML = PT1000[2].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("SolarTempName").innerHTML = PT1000[3].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("SolarInfoHMIPumpName").innerHTML = GPIOOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("SolarInfoHMIMixerName").innerHTML = GPIOOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("NiveauControlHMIWaterValveName").innerHTML = GPIOOUT[2].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("NiveauControlHMISensorName").innerHTML = GPIOIN[0].getElementsByTagName("InputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton2").innerHTML = GPIOOUT[4].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			
			setFunctionalButtons(LevelControl[0].getElementsByTagName("operationMode")[0].childNodes[0].nodeValue, "#NiveauControlHMIOperation", "#NiveauControlHMIStatusOperation", function(){
			});
		if (callback4){
			callback4();
			}
		}	
	});
}

function getXMLDataOperationModeHMI(callback4){
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			//var HUMIDITY = getXMLData.getElementsByTagName("HUMIDITY");
			//var PT1000 = getXMLData.getElementsByTagName("PT1000");
			var OperationMode = getXMLData.getElementsByTagName("OperationModeDevice");
			//var GPIOOUT = getXMLData.getElementsByTagName("GPIOOUT");
			//var GPIOIN = getXMLData.getElementsByTagName("GPIOIN");
			//var CleaningSetting = getXMLData.getElementsByTagName("CleaningSetting");
			//var SolarSetting = getXMLData.getElementsByTagName("SolarSetting");
			//var LevelControl = getXMLData.getElementsByTagName("LevelControl");
			//var TimerControl = getXMLData.getElementsByTagName("TimerControl");
			
			//document.getElementById("PoolTempName").innerHTML = PT1000[0].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("AirTempName").innerHTML = PT1000[1].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("BackWaterTempName").innerHTML = PT1000[2].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("SolarTempName").innerHTML = PT1000[3].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			//document.getElementById("SolarInfoHMIPumpName").innerHTML = GPIOOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("SolarInfoHMIMixerName").innerHTML = GPIOOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NiveauControlHMIWaterValveName").innerHTML = GPIOOUT[2].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NiveauControlHMISensorName").innerHTML = GPIOIN[0].getElementsByTagName("InputName")[0].childNodes[0].nodeValue;
			//document.getElementById("NameLightButton2").innerHTML = GPIOOUT[4].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			
			setFunctionalButtons(OperationMode[0].getElementsByTagName("AutomaticHand")[0].childNodes[0].nodeValue, "#OperationModeHMI", "#OperationModeHMIStatus", function(){
			});
		if (callback4){
			callback4();
			}
		}	
	});
}

function setFunctionalButtons(Status, Info, InfoStatus, callback){
	//console.log(Status, Info, InfoStatus);
	
	if(Status == "stop"){
		$(Info)
			.removeClass()
			.addClass("databox info btn btn-default switch-off")
		$(InfoStatus).html("HAND")
	} 
	else if(Status == "run"){
		$(Info)
			.removeClass()
			.addClass("databox info btn btn-default switch-on")
		$(InfoStatus).html("AUTO")
	}

	//Subfunctions	
	if(Status == 'OFF'){
		$(Info)
			.removeClass()
			.addClass("databox info btn btn-default switch-off")
		$(InfoStatus).html("AUS")
	} 
	else if(Status == 'AUTO') {
		$(Info)
			.removeClass()
			.addClass("databox info btn btn-default switch-on")
		$(InfoStatus).html("AUTO")
	}
	if(callback){
		callback();
	}
}

function setDataButtonsStartHMI(callback){
	setLightButtons(ServerData.GPIOout[3], "#LightButton1", "#imgLightButton1", function(){
		setLightButtons(ServerData.GPIOout[4], "#LightButton2", "#imgLightButton2", function(){				
		});
	});
	if(callback){
		callback();
	}
}

function refreshStartHMI(){
	StartHMITimeout = setInterval(function(){
		StartHMI();
	}, 5000);
}

function StartHMI(){
	getServerData(function(){
		$("#PoolTemp").text(ServerData.PoolTemp.toFixed(1));
		$("#AirTemp").text(ServerData.AirTemp.toFixed(1));
		setLightButtons(ServerData.GPIOout[3], "#LightButton1", "#imgLightButton1", function(){
			setLightButtons(ServerData.GPIOout[4], "#LightButton2", "#imgLightButton2", function(){
				getXMLDataStartHMI();			
			});
		});
	});
}

function refreshFilterHMI(){
	getServerData(function(){
		getXMLDataCleaningHMI(function(){
			setDeviceButtons(ServerData.GPIOout[0], "#CleaningInfoHMIPump", "#CleaningInfoHMIPumpStatus", function(){	
			});	
		});
		FilterHMITimeout = setTimeout(function(){
		refreshFilterHMI();
		}, 5000);
	});
}

function refreshSolarHMI(){
	getServerData(function(){
		getXMLDataSolarHMI(function(){
			setDeviceButtons(ServerData.GPIOout[0], "#SolarInfoHMIPump", "#SolarInfoHMIPumpStatus", function(){
				setDeviceButtons(ServerData.GPIOout[1], "#SolarInfoHMIMixer", "#SolarInfoHMIMixerStatus", function(){
					$("#BackwaterTemp").text(ServerData.BackwaterTemp.toFixed(1));
					$("#SolarTemp").text(ServerData.SolarTemp.toFixed(1));
				});
			});
		});
		SolarHMITimeout = setTimeout(function(){
		refreshSolarHMI();
		}, 5000);
	});
}

function refreshNiveauControlHMI(){
	getServerData(function(){
		getXMLDataNiveauControlHMI(function(){
			setDeviceButtons(ServerData.GPIOout[2], "#NiveauControlHMIWaterValve", "#NiveauControlHMIStatusWaterValve", function(){
				setDeviceInfolevel(ServerData.GPIOin[0], "#NiveauControlHMISensor", "#NiveauControlHMIStatusSensor", function(){
				});
			});
		});
		NiveauControlHMITimeout = setTimeout(function(){ 
		refreshNiveauControlHMI();
		}, 5000);
	});
}

function refreshOperationModeHMI(){
	getServerData(function(){
		getXMLDataOperationModeHMI(function(){
			
		});
		OperationModeHMITimeout = setTimeout(function(){ 
		refreshOperationModeHMI();
		}, 5000);
	});
}

function setDeviceButtons(StatusONOFF, ButtonName, ButtonStatus, callback){
	if(StatusONOFF == '0'){
		$(ButtonName)
			.removeClass()
			.addClass("databox info btn btn-default switch-off")
		$(ButtonStatus).html("AUS")
	}
	else if(StatusONOFF == '1'){
		$(ButtonName)
			.removeClass()
			.addClass("databox info btn btn-default switch-on")
		$(ButtonStatus).html("EIN")
	}
	if(callback){
		callback();
	}	
}

function setDeviceInfolevel(StatusONOFF, ButtonName, ButtonStatus, callback){
	if(StatusONOFF == '0'){
		$(ButtonName)
			.removeClass()
			.addClass("databox info btn btn-default switch-on")
		$(ButtonStatus).html("leer")
	}
	else if(StatusONOFF == '1'){
		$(ButtonName)
			.removeClass()
			.addClass("databox info btn btn-default switch-off")
		$(ButtonStatus).html("OK")
	}
	if(callback){
		callback();
	}	
}

function setLightButtons(StatusONOFF, ButtonNo, ButtonImg, callback){
	if(StatusONOFF == '0'){
		$(ButtonNo)
			.removeClass()
			.addClass("databox info btn btn-default switch-off")
		$(ButtonImg).attr("src", "/images/bulboff_icon_200_200.png")
	}
	else if(StatusONOFF == '1'){
		$(ButtonNo)
			.removeClass()
			.addClass("databox info btn btn-default switch-on")
		$(ButtonImg).attr("src", "/images/bulbonnew_icon_200_200.png")
	}
	if(callback){
		callback();
	}
}

// load functions and webpage opening
function startatLoad(){	
	loadNavbar(function(){
		getServerData(function(){
			displayStartHMI(function(){
				getXMLDataStartHMI(function(){
					setDataButtonsStartHMI(function(){
						refreshStartHMI();
					});
				});
			});
		});
	});
}

window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback3){
	getStatusLogin(function(Log_user, Log_admin){
		if(Log_user){	
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarHome").addClass("active");
					$("#navbar_home span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					if (Log_admin==false)
					{
						$("#navbarSet").hide();
						$("#navbar_set").hide();
					}
					});
				 });
			}
		else
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarHome").addClass("active");
					$("#navbar_home span").toggleClass("nav_notactive nav_active");
					$("#navbarlogout").hide();
					$("#navbarFunction").hide();
					$("#navbar_function").hide();
					$("#navbarSet").hide();
					$("#navbar_set").hide();
					$("#navbarHelp").hide();
					$("#navbar_help").hide();
					$("#panelStatusOperation").hide();
					$("#panelStatusActuators").hide();
					$("#panelAdditionalFunctions").hide();
					$("#panelQuickView").show();
				});
			});

		}
		if (callback3){
			callback3();
		}
	});
}



