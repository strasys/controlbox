/**
 * Composer JavaScript code
 * 
 * Johannes Strasser
 * 25.02.2017
 * www.strasys.at
 * 
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
		setgetServer("post","composerhandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getComposerLogin = JSON.parse(xhttp.responseText); 
			
			LoginStatus = [(getComposerLogin.loginstatus),
			               (getComposerLogin.adminstatus)
			               ];
				if (callback1){
				callback1();
				}
			}
		},"getLoginStatus=g");		
}
/*
 * This function set's and get's the status of the composer process.
 * If the composer script is running StatusComposerProcess = 1 else 0.
 */
function setgetStatusComposerProcess(setget,setrunstopStatus, callback2){
		setgetServer("post","composerhandler.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var setgetComposerProcessStatus = JSON.parse(xhttp.responseText); 
				
				StatusComposerProcess = [(setgetComposerProcessStatus.runstop)
				                         ];
					if (callback2){
					callback2();
					}
				}
			},"setgetComposerProcessStatus="+setget+"&setrunstopStatus="+setrunstopStatus);		
}

function setModeStatus(){
	if(StatusComposerProcess[0] == 1){
		document.getElementById("radioComposerRun").checked = true;
		document.getElementById("radioComposerStop").checked = false;
	}
	else if (StatusComposerProcess[0] == 0){
		document.getElementById("radioComposerRun").checked = false;
		document.getElementById("radioComposerStop").checked = true;
	}
}



// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
			refreshStatus();
		});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
 function loadNavbar(callback1){
			getStatusLogin(function(){
				if (LoginStatus[1])
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
					window.location.replace("/login.html");
				}
				if (callback1){
					callback1();
				}
			});
		 }
 /*
  * Refresh status of composer information's.
  */
 function refreshStatus(){
	 	setgetStatusComposerProcess("g","", function(){
			setModeStatus();
		});
		setTimeout(function(){refreshStatus()}, 10000);
	}
