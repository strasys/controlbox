/**
 * pushButtonSensing.js
 * The pushButtonSensing function is the
 * front end for the definition of the digital inputs 
 * which should be actuated by a push button.
 * Further, the run stop signales are handled.
 * 
 * Johannes Strasser
 * 27.03.2021
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

function getloginstatus(callback1){
		setgetServer("post","pushButtonSensing.php",function()
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

function getStatusPushButtonSet(callback){
	setgetServer("post","pushButtonSensing.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getStatusPushButtonSet = JSON.parse(xhttp.responseText); 
			/*
			  	getStatusPushButtonSet:
				0:N
				1:0				1:
				etc.
			*/
			
				if (callback){
				callback(getStatusPushButtonSet);
				}
			}
		},"PushButtonStatus=get");		
	
}

//This function will be called once on start.
//The names of the inputs are stored in a XML file on the server.
function getNamingXMLData(StatusPushButtonSet,callback3){
	setgetServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
					{
					var getXMLData = xhttp.responseXML;
					var w = getXMLData.getElementsByTagName("GPIOIN");
					var z = getXMLData.getElementsByTagName("InputName");
					var i = 0;
					var checkboxStatus = "";

					for (i=0; i<w.length; i++){
						if(StatusPushButtonSet[i] == "N"){
							checkboxStatus = "";
						} else if(StatusPushButtonSet[i] == "0" || StatusPushButtonSet[i] == "1"){
							checkboxStatus = "checked";
						}
						$("#boxesPushButtonSensing").append(
							"<div class=\"checkbox\">"+
			    				"<label>"+
			      					"<input id=\"inputcheckboxpushButtonSensing"+i+"\""+checkboxStatus+" type=\"checkbox\" onclick=PushButtonCheckboxEvent("+i+") style=\"margin-top: 10px;\">"+
			      					"<h5>"+z[i].childNodes[0].nodeValue+"</h5>"+
			    				"</label>"+
			 				"</div>"
						);
						$("#StatusinformationPushButtonSensing").append(
							"<h5 style=\"margin-top: 23px;\"> IN "+i+" = "+
							StatusPushButtonSet[i]+" "+z[i].childNodes[0].nodeValue+"</h5>"
						)
					}
					if (callback3){
						callback3();
					}
					
					}
			});		
}

function PushButtonCheckboxEvent(GPIONum){
	var checkboxStatus = $("#inputcheckboxpushButtonSensing"+GPIONum).prop('checked');

	
	setgetServer("post","pushButtonSensing.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				
				 
			}
		},"PushButtonStatus=set&GPIONum="+GPIONum+"&CheckboxStatus="+checkboxStatus);
}

function setgetStatusPushButtonservice(keyword,ONOFF,callback){
	
		var loopcycle = $("#pushButtonloopCycle").val();

	setgetServer("post","pushButtonSensing.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				var runStatus = JSON.parse(xhttp.responseText); 
					if(runStatus == 'run'){
						$("#PushbuttonOperationmode input[value='run']").prop("checked",true);
					} else if(runStatus == 'stop'){
						$("#PushbuttonOperationmode input[value='stop']").prop("checked",true);
					}
				if(callback){
					callback();
				}
				 
			}
		},"setgetStatusPushButtonservice="+keyword+"&ONOFF="+ONOFF+"&loopcycle="+loopcycle);
}

function setSelectLoopCycle(callback){
		for(x=0;x<15;x++){
			var y = document.getElementById("pushButtonloopCycle");
			var option1 = document.createElement("option");
			option1.text = 10*x+10;
			y.options.add(option1);
		}
		$("#pushButtonloopCycle").val(80);
	
	if (callback){
		callback();
	}
}

// load functions at web page opening
function startatLoad(){
	loadNavbar(function(){
		getStatusPushButtonSet(function(StatusPushButtonSet){
			getNamingXMLData(StatusPushButtonSet, function(){
				setSelectLoopCycle(function(){
					setgetStatusPushButtonservice('get');
				});	
			});
		});	
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
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
	});		 }



