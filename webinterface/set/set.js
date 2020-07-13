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
		setgetServer("post","/userLogStatus.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var LogStatus = JSON.parse(xhttp.responseText); 
			
			Log = [(LogStatus.loginstatus),
			       (LogStatus.adminstatus)
			               ];
				if (callback1){
				callback1();
				}
			}
		});		
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
 function loadNavbar(callback1){
			getStatusLogin(function(){
				if (Log[1])
				{
					$(document).ready(function(){
						$("#mainNavbar").load("/navbar.html?ver=3", function(){
							$("#navbarSet").addClass("active");
							$("#navbarlogin").hide();
							$("#navbar_set span").toggleClass("nav_notactive nav_active");
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

$("#Time_Date").on('click', function(){
	window.location = "/set/time_date/timeanddate.html?ver=0";
});

$("#UserOrg").on('click', function(){
	window.location = "/set/user/user.html?ver=0";
});

$("#RegisterDevice").on('click', function(){
	window.location = "/set/registration/deviceOwnerRegistration.html?ver=0";
});

$("#DeviceName").on('click', function(){
	window.location = "/set/deviceName/deviceName.html?ver=0";
});

$("#Parametrisation").on('click', function(){
	window.location = "/set/parameter/parametrisation.html?ver=0";
});

$("#hardware").on('click', function(){
	window.location = "/set/hardware/hardware.html?ver=1";
});

$("#data_cloud").on('click', function(){
	window.location = "/set/data_cloud/data_cloud.html?ver=0";
});


