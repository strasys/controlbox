/**
 *data_cloud JavaScript code
 * 
 * Johannes Strasser
 * 15.10.2017
 * www.strasys.at
 * 
 */
sortoutcache = new Date();
var EEPROMext;
var selected_line;
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

function getExtensions(callback){
	setgetServer("post","data_cloud.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var ext = JSON.parse(xhttp.responseText); 
			EEPROMext = [ 	(ext[1]),
					(ext[3]),
					(ext[5]),
					(ext[7])	];
			
				if (callback){
				callback();
				}
			}
		});		
}

function sethardwarehtmlinterface(callback){
	var a = 1;
	var counter_PT1000 = 0;
	var counter_AOUT = 0;
	var counter_AIN = 0;
	var counter_HUMIDITY = 0;
	var i=0;
	for (i=0;i<4;i++){
		switch(EEPROMext[i]) {
			case "PT1000":
				counter_PT1000 += 1;
				var idData = "PT1000"+counter_PT1000;
				var header = "PT1000 "+counter_PT1000;
				var selectVal = "PT1000";
				loadExtensions(i+1, idData, header, function(){
					setSelectExt(idData+"_Select_Val", selectVal, idData+"_Select_Interval", function(){
					});
				});
				break;
			case "AOUT":
				counter_AOUT += 1;
				var idData = "AOUT"+counter_AOUT;
				var header = "Analoge Ausgänge "+counter_AOUT;
				var selectVal = "AOUT";
				loadExtensions(i+1, idData, header, function(){	
					setSelectExt(idData+"_Select_Val", selectVal, idData+"_Select_Interval", function(){
					});
				});
				break;
			case "AIN":
				counter_AIN += 1;
				var idData = "AIN"+counter_AIN;
				var header = "Analoge Eingänge";
				var selectVal = "AIN";
				loadExtensions(i+1, idData, header, function(){
					setSelectExt(idData+"_Select_Val", selectVal, idData+"_Select_Interval", function(){
					});
				});
				break;
			case "HUMIDITY":
				counter_AIN += 1;
				var idData = "HUMIDITY"+counter_HUMIDITY;
				var header = "Feuche Sensor Eingänge";
				var selectVal = "HUMIDITY";
				loadExtensions(i+1, idData, header, function(){
					setSelectExt(idData+"_Select_Val", selectVal, idData+"_Select_Interval", function(){
					});
				});
				break;
		}
	}
	
	if (callback){
		callback();
	}
}


function setSelectDigiInput(callback){
	settimeinterval("Digi_IN_Select_Interval",function(){
		for(i=0;i<12;i++){
			var y = document.getElementById("Digi_IN_Select_Val");
			var option1 = document.createElement("option");
			option1.text = "DigiIN_"+i;
			y.options.add(option1);
		}

		if(callback){
			callback();
		}
	});
}

function setSelectDigiOutput(callback){
	settimeinterval("Digi_OUT_Select_Interval",function(){
		for(i=0;i<12;i++){
			var y = document.getElementById("Digi_OUT_Select_Val");
			var option1 = document.createElement("option");
			option1.text = "DigiOUT_"+i;
			y.options.add(option1);	
		}
	
		if(callback){
			callback();
		}
	});
}

function setSelectExt(idSelectVal, selectVal, idSelectInterval, callback){
	var i=0;
		for(i=0;i<2;i++){
			var y = document.getElementById(idSelectVal);
			var option1 = document.createElement("option");
			option1.text = selectVal+"_"+(i);
			y.options.add(option1);	
		}
	
		var timeinterval = [1,2,3,4,5,10,15,20,30,40,50,60];

	for(i=0;i<(timeinterval.length);i++){
		var y = document.getElementById(idSelectInterval);
		var option1 = document.createElement("option");
		option1.text = timeinterval[i];
		y.options.add(option1);
	}

	
	if(callback){
		callback();
	}
}

function settimeinterval(idName, callback){
	var timeinterval = [1,2,3,4,5,10,15,20,30,40,50,60];

	for(i=0;i<(timeinterval.length);i++){
		var y = document.getElementById(idName);
		var option1 = document.createElement("option");
		option1.text = timeinterval[i];
		y.options.add(option1);
	}
	
	if(callback){
		callback();
	}
}

function getXMLDataCloud(callback){
	setgetServer("GET", "/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getXML = xhttp.responseXML;
			//DataCloudPush Mode
			var wM = getXML.getElementsByTagName("OperationModeDevice")[0];
			var xM = wM.getElementsByTagName("PushDataCloudService");
			var statusPushMode = xM[0].childNodes[0].nodeValue;
			switch (statusPushMode){
				case "run":
					document.getElementById("radioCloudPushModeRUN").checked = true;
					break;
				case "stop":
					document.getElementById("radioCloudPushModeOFF").checked = true;
					break;
			}
			//data_cloud
			var w = getXML.getElementsByTagName("data_cloud")[0];
			var x = w.getElementsByTagName("datatocloud");
			var z = x.length;
			var i = 0;

			$("#data_selected_list_head").empty();
			$("#data_selected_userlist_body").empty();

			//console.log("Anzahl Einträge = "+z);

			$("<th>Auswahl</th><th>Type</th><th>Ext.</th><th>Messstellen_ID</th><th>Interval[min.]</th><th>Einheit</th><th>Umrechnung</th>").appendTo("#data_selected_list_head");

			for (i=0; i<z; i++){
				var tab_val_string = x[i].childNodes[0].nodeValue;
				//console.log(tab_val_string);
				var tab_val_single = tab_val_string.split(":");
				
				$("<tr><td><label><input type=\"radio\" name=\"data_num\" value=\""+i+"\"></label></td>"+
					"<td>"+tab_val_single[0]+"</td>"+
					"<td>"+tab_val_single[1]+"</td>"+
					"<td>"+tab_val_single[2]+"</td>"+
					"<td>"+tab_val_single[3]+"</td>"+
					"<td>"+tab_val_single[4]+"</td>"+
					"<td>"+tab_val_single[5]+"</td>"+
				"</tr>")
				.appendTo("#data_selected_userlist_body");
			}	
		}
		if (callback){
			callback();
		}	
	});		
}

function setXMLDataCloud(Node_Name, Data_String, callback2){
		setgetServer("post","datatoXML.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
					var getResponse = JSON.parse(xhttp.responseText);
					if (callback2){
						callback2(getResponse.write_XML);
					}
				}
			},"Node_Name="+Node_Name+"&Data_String="+Data_String);
}	


function deleteXMLDataCloud(Node_Name, dataNo, callback2){
		setgetServer("post","dataDeleteXML.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
					var getResponse = JSON.parse(xhttp.responseText);
					if (callback2){
						callback2(getResponse.delete_XML);
					}
				}
			},"Node_Name="+Node_Name+"&dataNo="+dataNo);
}	

function setDataPushModeXML(radioID){
	var ModeStatus = document.getElementById(radioID).value;		
	
		setgetServer("post","PushCloudservicehandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
					
			}
		},
		"setrunstopStatus="+ModeStatus);
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
	//	setSelectDigiOutput(function(){
		//	setSelectDigiInput(function(){
				getExtensions(function(){
					getXMLDataCloud(function(){
						sethardwarehtmlinterface();
					});
				});
	//		});
	
	//	});
	});
}
window.onload=startatLoad();

// select user line
$("#data_selected_userlist_body").on('change', function(){
	selected_line = $('input[name=data_num]:checked', '#data_selected_userlist_body').val();
	//console.log(selected_line);
});


// select user line
$("#Button_delete_data").on('click', function(){
	var Node_Name = "datatocloud";
	deleteXMLDataCloud(Node_Name, selected_line, function(response){
		//console.log(response);
		$("#data_selected_userlist_body").load(window.location.href + " #data_selected_userlist_body", function(){
			getXMLDataCloud();
		});
	});		
});

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
function loadNavbar(callback1){
			getStatusLogin(function(){
				if (Log[0])
				{
					$(document).ready(function(){
						$("#mainNavbar").load("/navbar.html?ver=2", function(){
							$("#navbarSet").addClass("active");
							$("#navbar_set span").toggleClass("nav_notactive nav_active")
							$("#navbarlogin").hide();
							
							if (Log[1]==false)
							{
								$("#navbarSet").hide();
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

function addtoCloudData(idButton){
	
	var Val_Name = document.getElementById(idButton+"_Select_Val").value;
	var Interval = document.getElementById(idButton+"_Select_Interval").value;
	var Messstelle_Name = document.getElementById("Messstellen_ID_"+idButton).value;
	var MessstellenEinheit = document.getElementById("Messstellen_Einheit_"+idButton).value;
	var Extension_Num = document.getElementById(idButton+"_Ext").value;
	var Messstellen_Umrechnung = document.getElementById("Messstellen_Umrechnung_"+idButton).value;

	//add Line to Cloud Data
	var Node_Name = "data_cloud";
	var Data_String = Val_Name+":"+Extension_Num+":"+Messstelle_Name+":"+Interval+":"+MessstellenEinheit+":"+Messstellen_Umrechnung;
	
	//console.log(Data_String);
	setXMLDataCloud(Node_Name,Data_String, function(response){
		//console.log("Schreib Rückmeldung ="+response);
		//clear thead and tbody of table before rewrite
		$("#data_selected_userlist_body").load(window.location.href + " #data_selected_userlist_body", function(){
			getXMLDataCloud();
		});	
	});	
}

function loadExtensions(ExtensionNo, idData, header, callback){

	$("#Extension"+ExtensionNo).html("	<div id=\""+idData+"\" class=\"databox info\" style=\"border-radius:0px; min-width:100%;\">"+
				"<div class=\"page-header\">"+
					"<h3 style=\"color:#0087e8;\">"+header+"</h3>"+
				"</div>"+
				"<div class=\"input-group\">"+	
					"<span class=\"input-group-addon\">Wert</span>"+
					"<select id=\""+idData+"_Select_Val\" class=\"form-control\" style=\"min-width:200px;\"></select>"+
					"<span class=\"input-group-addon\">Ext.</span>"+
					"<input id=\""+idData+"_Ext\" type=\"text\" class=\"form-control\" value=\""+ExtensionNo+"\" readonly></input>"+
					"<span class=\"input-group-addon\">Zeit-Interval [Minuten]</span>"+
					"<select id=\""+idData+"_Select_Interval\" class=\"form-control\"></select>"+
				"</div>"+
				"<p></p>"+
				"<div class=\"input-group\">"+
					"<span class=\"input-group-addon\">Messstellen ID</span>"+
					"<input id=\"Messstellen_ID_"+idData+"\" type=\"text\" class=\"form-control\" placeholder=\"Messstellen Name \" style=\"min-width:200px;\">"+
					"<span class=\"input-group-addon\">Einheit</span>"+
					"<input id=\"Messstellen_Einheit_"+idData+"\" type=\"text\" class=\"form-control\">"+
					"<span class=\"input-group-addon\">Umrechnung</span>"+
					"<input id=\"Messstellen_Umrechnung_"+idData+"\" type=\"text\" class=\"form-control\" >"+

					"<span class=\"input-group-btn\">"+
						"<button id=\"Button_add_"+idData+"\" class=\"btn btn-default\" type=\"button\" onclick=\"addtoCloudData('"+idData+"')\">Add</button>"+
					"</span>"+
				"</div>"+
				"<p></p>"+
			"</div>"
	);
			
	if (callback){
		callback();
	}

};
