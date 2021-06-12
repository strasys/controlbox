/**
 * FIFOPuffering.js
 * The FIFOPuffering function writes Analog values
 * like PT1000 in a txt file for fast access
 * 
 * Johannes Strasser
 * 11.06.2021
 * www.strasys.at
 */

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
		setgetServer("post","FIFOPuffering.php",function()
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

function setgetFIFOPuffering(setget,checkboxStatus, PufferID, callback){
	setgetServer("post","FIFOPuffering.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var FIFOPuffering = JSON.parse(xhttp.responseText); 
			
			/*
			FIFOPuffering = [
					(getLogData.loginstatus),
					(getLogData.adminstatus)
			                          ];
			*/
			
				if (callback){
				callback(FIFOPuffering);
				}
			}
		},"setgetFIFOPuffering="+setget+"&CheckboxStatus="+checkboxStatus+"&PufferID="+PufferID);	
}

function loadData(callback){
	$(document).ready(function(){
		 var FIFONodes = $("#FIFOPufferDataType input[id]").get();
		 var arrPuffer = [];
		for(i=0;i<FIFONodes.length;i++){
			arrPuffer.push(FIFONodes[i].id);
		}
		setgetFIFOPuffering("g","",arrPuffer,function(arrStatus){
			for(i=0;i<FIFONodes.length;i++){
				if(arrStatus[FIFONodes[i].id] == 'stop'){
					$("#"+FIFONodes[i].id).attr("checked", false);
				} else if(arrStatus[FIFONodes[i].id] == 'run'){
					$("#"+FIFONodes[i].id).attr("checked", true);
				}
				
			}
		});
	});
	
	if(callback){
		callback();
	}
}

function loadlast(){
	const el = document.querySelectorAll("input[type=checkbox]");
	for(i=0;i<el.length;i++){
		document.getElementById(el[i].id).addEventListener("change", clickcheck);
	}
	
	function clickcheck(e){
		if(e.target.checked){
			//setgetFIFOPuffering(setget,CheckboxStatus,PufferID)
			setgetFIFOPuffering("s",true, e.target.id);
		} else {
			setgetFIFOPuffering("s",false, e.target.id);
		}
	}

}

// load functions at web page opening
function startatLoad(){
	loadNavbar(function(){
		loadData(function(){
			loadlast();
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