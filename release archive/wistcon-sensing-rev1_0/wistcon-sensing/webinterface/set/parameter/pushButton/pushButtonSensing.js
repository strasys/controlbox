/**
 * pushButtonSensing.js
 * The pushButtonSensing function is the
 * front end for the definition of the digital inputs 
 * which should be actuated by a push button.
 * Further, the run stop signales are handled.
 * 
 * Johannes Strasser
 * 19.10.2015
 * www.strasys.at
 */
sortoutcache = new Date();

/*
 * Asynchron server send function.
 */
function setgetServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}
/*
 * This function get's the login status.
 */

function getStatusLogin(callback1){
		setgetServer("post","pushButtonSensinghandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getpushButtonSensingLogin = JSON.parse(xhttp.responseText); 
			
			LoginStatus = [(getpushButtonSensingLogin.loginstatus),
			               (getpushButtonSensingLogin.adminstatus)
			               ];
				if (callback1){
				callback1();
				}
			}
		},"getLoginStatus=g");		
}
/* 
 * setgetpushButtonSensingStatus can be used to get the most actual status of the 
 * push Button sensing process:
 * With the information N, 1, 0
 * N = No sensing
 * 1 = sensing on, off (PNP positive negative positive)
 * 0 = sensing off, on
 * This function set's and get's the status of the push button sensing process.
 * If the sensing function is running runstop = 1 else 0.
 * With errorMsg the PHP function transfers possible error messages.
 */
function setgetStatuspushButtonSensingProcess(setget,setrunstopStatus, inputActivationStatus, callback2){	
		setgetServer("post","pushButtonSensinghandler.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var setgetpushButtonSensingProcessStatus = JSON.parse(xhttp.responseText); 
				
				StatuspushButtonSensingProcess = [(setgetpushButtonSensingProcessStatus.runstop),
				                                  (setgetpushButtonSensingProcessStatus.errorMsg),
				                                  (setgetpushButtonSensingProcessStatus.IN0),
				                                  (setgetpushButtonSensingProcessStatus.IN1),
				                                  (setgetpushButtonSensingProcessStatus.IN2),
								  (setgetpushButtonSensingProcessStatus.IN3),
								 (setgetpushButtonSensingProcessStatus.IN4),
								 (setgetpushButtonSensingProcessStatus.IN5),
								 (setgetpushButtonSensingProcessStatus.IN6),
								 (setgetpushButtonSensingProcessStatus.IN7),
								 (setgetpushButtonSensingProcessStatus.IN8),
								 (setgetpushButtonSensingProcessStatus.IN9),
								 (setgetpushButtonSensingProcessStatus.IN10),
								 (setgetpushButtonSensingProcessStatus.IN11)
				                                  ];
				
					if (callback2){
					callback2();
					}
				}
			},"setgetpushButtonSensingProcessStatus="+setget+"&setrunstopStatus="+setrunstopStatus+
			"&sensingChannels="+inputActivationStatus);		
}



/*
 * This function sets the color and the badge description of the pushButtonSensing button.
 */
function setButtonColorBadge(ButtonNumber, callback7){
	 switch (ButtonNumber){
	 case 0:
			if(StatuspushButtonSensingProcess[0] == 1){
				span = document.getElementById("badgebuttonpushButtonSensingScriptOnOff");
				span.textContent = "EIN";
				button = document.getElementById("buttonpushButtonSensingOnOff");
				button.getAttributeNode("class").value = "btn btn-success";
			}
			if(StatuspushButtonSensingProcess[0] == 0) {
				span = document.getElementById("badgebuttonpushButtonSensingScriptOnOff");
				span.textContent = "AUS";
				button = document.getElementById("buttonpushButtonSensingOnOff");
				button.getAttributeNode("class").value = "btn btn-danger";
			}
			break;
	 }
	 if (callback7){
		 callback7();
	 }
}

sortoutcache = new Date();

//This function will be called once on start.
//The names of the inputs are stored in a XML file on the server.
function getNamingXMLData(callback3){
	setgetServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
					{
					var getXMLData = xhttp.responseXML;
					var w = getXMLData.getElementsByTagName("InputName");
					var z = getXMLData.getElementsByTagName("InputName");
					var i = 0;
					for (i=0; i<w.length; i++){
						document.getElementById("checkboxTextpushButtonSensing"+i).innerHTML=z[i].childNodes[0].nodeValue;	
						}
					if (callback3){
						callback3();
					}
					
					}
			});		
}
/*
 * Get and set either an input is set for push button sensing.
 */

function setgetpushButtonSensingActivation(setget, callback4){
	inputActivationStatus = new Array();
	if (setget == "set"){
		for (i=0;i<12;i++){
			if (document.getElementById("inputcheckboxpushButtonSensing"+i).checked){
			inputActivationStatus[i] = 1;
			}
			else
			{
				inputActivationStatus[i] = 0;
			}
			$("#inputcheckboxpushButtonSensing"+i).attr("disabled", "disabled");
			$("#checkboxpushButtonSensing"+i).addClass("disabled");
		}
		
	}
	if(setget == "get"){
		for (i=0;i<12;i++){
			$("#inputcheckboxpushButtonSensing"+i).removeAttr("disabled", "disabled");
			$("#checkboxpushButtonSensing"+i).removeClass("disabled");
		}	
	}
	if (callback4){
		callback4();
	}	
}

/*
 * pushButtonSensingActiviation 
 */

function ButtonpushButtonSensingAction(ButtonNumber){
	switch (ButtonNumber){
	case 0:
		if(StatuspushButtonSensingProcess[0] == 1){
			setgetpushButtonSensingActivation("get",function(){
				setgetStatuspushButtonSensingProcess("s","0","", function(){
					refreshStatus(function(){
						setButtonColorBadge(0);				
					});
				});
			});
			
		}
		if(StatuspushButtonSensingProcess[0] == 0){
			setgetpushButtonSensingActivation("set", function(){
				setgetStatuspushButtonSensingProcess("s","1", inputActivationStatus, function(){
					refreshStatus(function(){
						setButtonColorBadge(0);
					});
				});
			});
		}
		break;
	}
}

/*
 * updatecheckboxSensingStatus 
 * This function 
 */
function updatecheckboxSensingStatus(callback5){
	for(i=0;i<12;i++){
		var x = document.getElementById("inputcheckboxpushButtonSensing"+i);
		if ((StatuspushButtonSensingProcess[i+2] == 0) || (StatuspushButtonSensingProcess[i+2] == 1)){
			x.checked = true;
			if (StatuspushButtonSensingProcess[0] == 1){
				x.setAttribute("disabled", "disabled");
			}
			else if (StatuspushButtonSensingProcess[0] == 0) {
				x.removeAttribute("disabled");
			}
		}
		else if (StatuspushButtonSensingProcess[i+2] == "N"){
			x.checked = false;
			if (StatuspushButtonSensingProcess[0] == 1){
				x.setAttribute("disabled", "disabled");
			}
			else if (StatuspushButtonSensingProcess[0] == 0) {
				x.removeAttribute("disabled");
			}
		}
	}

	if (callback5){
		callback5();
	}
}
/*
 * The StatusinformationPushButtonSensing() is a function to print
 * the status informations of the process.
 */
function StatusinformationPushButtonSensing(callback6){
		//Function must be optimized to replace information in existing Elements once created.
	for (i=0;i<12;i++){
		var element = document.getElementById("StatusinformationPushButtonSensing");
		var tagInfo = element.getElementsByTagName("p");
		var node = document.createTextNode("Eingang "+i+" : "+StatuspushButtonSensingProcess[i+2]);
		var statusInfo = document.createElement("p");
		if(tagInfo[i] != null){
			var tagNodes = tagInfo[i].childNodes;
			tagNodes[0].nodeValue = "Eingang "+i+" : "+StatuspushButtonSensingProcess[i+2];
			//tagInfo[i].appendChild(node);
		}
		else {
			statusInfo.appendChild(node);
			element.appendChild(statusInfo);
		}	
	}
	if(callback6){
		callback6();
	}
}


// load functions ad web page opening
function startatLoad(){
	loadNavbar(function(){
		getNamingXMLData(function(){
			refreshStatus();
		});	
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
 function loadNavbar(callback1){
			getStatusLogin(function(){
				if (LoginStatus[0])
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
 /*
  * Refresh status of pushButtonSensing information's.
  */

function refreshStatus(callback){
	 	setgetStatuspushButtonSensingProcess("g","","", function(){
			setButtonColorBadge(0, function(){
				updatecheckboxSensingStatus(function(){
					StatusinformationPushButtonSensing(function(){
						if (callback){
							callback();
						}
					});
				});
			});
		});
	//	setTimeout(function(){refreshStatus()}, 5000);
}

