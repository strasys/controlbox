/**
 * set the device Name and write to server
 * Johannes Strasser
 * 19.01.2019
 * www.wistcon.at
 */

function setgetdata(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

function getloginstatus(callback1){
	setgetdata("post","/userLogStatus.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
					{
						var statusLogIn = JSON.parse(xhttp.responseText);
						
						LogInStatusCheck = [(statusLogIn.loginstatus),
						                    (statusLogIn.adminstatus)
						                    ];
						if (callback1){
							callback1();
						}
					}
			});
}

function getRegistrationData(callback1){
	setgetdata("post","/set/registration/deviceOwnerRegistrationStatus.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var registrationData = JSON.parse(xhttp.responseText);
		
			/*	
			'registrationstatus' => $returnDataValues[0],
			'productexist' => $returnDataValues[1],
			'accountstatus' => $returnDataValues[7],
			'email' => $returnDataValues[6],
			'gender' => $returnDataValues[3],
			'firstname' => $returnDataValues[4],
			'familyname' => $returnDataValues[5],
			'userID' => $returnDataValues[2],
			'productname' => $returnDataValues[8]
			*/

			if (callback1){
				callback1(registrationData);
			}
		}
	});
}

function setNewName(newName, callback1){
	setgetdata("post","deviceName.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var writeanswer = JSON.parse(xhttp.responseText);
		
			/*	
			'product_registered' => $returnDataValues[0],
			'product_registerID_exist' => $returnDataValues[1],
			'database_write' => $returnDataValues[2],
			'num_char_name' => $returnDataValues[3],
			'namewritten' => $returnDataValues[4]
			*/

			if (callback1){
				callback1(writeanswer);
			}
		}
	},"newName="+newName);
}

function showhide_at_load(callback){
	$("#setdevicename").hide();
	$("#deviceName input").hide();
	$("#ButtondeviceName").hide();
	$("#info_deviceName_Change").hide();
	if(callback){
		callback();
	}
}

function displayName(callback){
	$("<div class=\"loader pos-rel\"></div>").appendTo("#div_deviceName");

	getRegistrationData(function(data){
		if(data.registrationstatus != 1){
			$("	<div class=\"col-md-12 col-xs-12\">"+
				"<div class=\"alert alert-danger\" role=\"alert\"><strong>Achtung! Registrierung nicht abgeschlossen oder durchgeführt</strong><br><br>"+
				"Bitte führen Sie zuerst die Registrierung im Menü /set/Registrierung aus!<br>"+
				"Bzw. schließen Sie den Registrierungsprozess ab."+
				"</div>"+
				"</div>"
			).appendTo("#div_deviceName");
			$("#div_deviceName div.loader").remove();
		} else {
			$("#deviceName input").val(data.productname).prop("disabled", true).show();
			$("#deviceName label").text("Geräte Name ");
			$("#ButtondeviceName").text("Namen ändern").val("change").show();
			$("#div_deviceName div.loader").remove();
		}
	});
	
	if(callback){
		callback();
	}
}
	    
function startatLoad(){
	showhide_at_load(function(){
		loadNavbar(function(){
			displayName();
		});
	});	
} 
		window.onload=startatLoad;
		
			 
//Load the top fixed navigation bar and highlight the 
//active site roots.
function loadNavbar(callback){
	getloginstatus(function(){
		if (LogInStatusCheck[0])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarSet").addClass("active");
					$("#navbar_set span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					if (LogInStatusCheck[1]==false)
					{
						$("#navbarSet").hide();
						$("#navbar_set").hide();
					}
				});
			});
		}
		else
		{
			window.location.replace("/login.html");
		}
		if (callback){
			callback();
		}
	});
}

//jQuery - Funktionen
$(document).ready(function(){
	$("#ButtondeviceName").click(function(){
		if ($(this).val() == "change")
		{
			$(this).text("Speichern").val("save");
			$("#deviceName input").prop("disabled", false).prop("maxlength", 30).focus();
			$("	<div id=\"info_deviceName_Change\" class=\"col-md-12 col-xs-12\" style=\"margin-top:20px;\">"+
				"<div class=\"alert alert-info\" role=\"alert\">"+
				"<strong>Info!</strong> Max. 30 Zeichen inkl. Leezeichen für den Gerätenamen."+
				"</div>"
			).appendTo("#div_deviceName form");
		}		
		else if ($(this).val() == "save"){
			var newName = $("#deviceName input").val();
			setNewName(newName, function(){
				showhide_at_load(function(){
					displayName();
				});
			});			
		}
    	});
});
