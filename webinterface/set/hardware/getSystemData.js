/**
 * Program to display System Data's
 * 
 * 03.01.2019
 * Johannes Strasser
 * 
 * www.wistcon.at
 */

sortoutcache = new Date();

function getServerData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

function getStatusLogin(callback1){
		getServerData("post","/userLogStatus.php",function()
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

function getSystemData(callback1){
		getServerData("post","getSystemData.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				var data = JSON.parse(xhttp.responseText); 
				/*
					'manu' => $BasicInfo[0],
					'mainboard_drawing' => $BasicInfo[1],
					'production_date' => $BasicInfo[2],
					'ext1addr' => $SensorHardware[0],
					'ext1name' => $SensorHardware[1],
					'ext2addr' => $SensorHardware[2],
					'ext2name' => $SensorHardware[3],
					'ext3addr' => $SensorHardware[4],
					'ext3name' => $SensorHardware[5],
					'ext4addr' => $SensorHardware[6],
					'ext4name' => $SensorHardware[7],
					'deviceID' => $deviceID,
					'RTCuse' => $RTC,
					'Kernel' => $KernelVers[0],
					'Debian' => $DebianVers[0],
					'IPaddressServer' => $IPaddressServer,
					'IPaddressUser' => $IPaddress_user

				*/
				if (callback1){
					callback1(data);
				}
			}
		});		
}

// This function is called after pressing the "Button Beschriftung ändern" button.
// The function loads the actual button naming form the XML - file on the server
// into the input fields.

/*
function getCookie(cname, callback) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
	if (c.indexOf(name) == 0) {
		return callback(c.substring(name.length, c.length));
	        }
    }
	return callback("");
}
*/
//Display System Info's
function DisplaySystemInfos(){
	getSystemData(function(data){
		$("#manufacturer").html(
			"<ul style=\"list-style-type:none\">"+
				"<li><strong>Hersteller</strong></li>"+
				"<li>"+data.manu+"</li>"+
			"</ul>"
		);
		$("#network").html(
			"<ul style=\"list-style-type:none\">"+
				"<li><strong>Netzwerk</strong></li>"+
				"<li>IP Addresse Host (=wiston device): "+data.IPaddressServer+"</li>"+
				"<li>IP Addresse Client (=aufrufendes Gerät): "+data.IPaddressUser+"</li>"+
			"</ul>"
		);

		$("#hardwareInfos").html(
			"<ul style=\"list-style-type:none\">"+
				"<li><strong>Hardware</strong></li>"+
				"<li>Mainboard: "+data.mainboard_drawing+"</li>"+
				"<li>Produktionsdatum: "+data.production_date+"</li>"+
				"<br>"+
				"<li><strong>Sensoren</strong></li>"+
				"<li>Sensor1 => Name: "+data.ext1name+" / I2C addr: "+data.ext1addr+"</li>"+
				"<li>Sensor2 => Name: "+data.ext2name+" / I2C addr: "+data.ext2addr+"</li>"+
				"<li>Sensor3 => Name: "+data.ext3name+" / I2C addr: "+data.ext3addr+"</li>"+
				"<li>Sensor4 => Name: "+data.ext4name+" / I2C addr: "+data.ext4addr+"</li>"+
				"<br>"+
				"<li>Uhr: "+data.RTCuse+"</li>"+
			"</ul>"			
		);
		$("#software").html(
			"<ul style=\"list-style-type:none\">"+
				"<li><strong>Software</strong></li>"+
				"<li>Debian Version: "+data.Debian+"</li>"+
				"<li>Kernel Version: "+data.Kernel+"</li>"+
			"</ul>"			
		);
		$("#deviceID").html(
			"<ul style=\"list-style-type:none\">"+
				"<li><strong>Device Key:</strong></li>"+
				"<li>"+data.deviceID+"</li>"+
			"</ul>"			
		);
	

	});
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		DisplaySystemInfos();
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getStatusLogin(function(){
		if (Log[1])
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

