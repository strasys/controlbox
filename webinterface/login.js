/**
 * login handling client
 * Johannes Strasser
 * www.strasys.at
 * 25.02.2017
 * 
 */

sortoutcache = new Date();

var inputUsername;
var inputPassword;
var inputrememberlogin;

function setgetuser(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

 function setgetUserPassword(Username, Password, rememberlogin, callback1){
		setgetuser("post","login.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var statusUsernamePassword = JSON.parse(xhttp.responseText); 
				
				statusSetUsername = [(statusUsernamePassword.errorFile),
							(statusUsernamePassword.errorUsername),
							(statusUsernamePassword.errorPassword),
							(statusUsernamePassword.username)
						];
					if (callback1){
						callback1();
					}
				}
			},"username="+Username+"&password="+Password+"&rememberlogin="+rememberlogin);		
}
 

function submitUserData(callback){
	inputUsername = document.getElementById("login_username").value;
	inputPassword = document.getElementById("login_password").value;
	inputrememberlogin = document.getElementById("login_checkbox").checked;
	if (inputrememberlogin)
	{
		inputrememberlogin = 1;
	}
	else
	{
		inputrememberlogin = 0;
	}

	if (callback){
		callback();
	}	
}

//Alert information
function DisplayLoginInformation(callback3){
	$(window).scrollTop(0);
	switch (statusSetUsername[2]){
		case -1:
			$("#icon-login-msg").removeClass();
			$("#icon-login-msg").addClass("login-icon glyphicon glyphicon-remove error");
			$("#text-login-msg").html("Login fehlgeschlagen!");
			$("#div-login-msg-customer").removeClass();
			$("#div-login-msg-customer").addClass("login-msg error");
			break;
		case 1:
			$("#icon-login-msg").removeClass();
			$("#icon-login-msg").addClass("login-icon glyphicon glyphicon-ok success");
			$("#text-login-msg").html("Login erfolgreich!");
			$("#div-login-msg-customer").removeClass();
			$("#div-login-msg-customer").addClass("login-msg success");
			break;
	}

	if (callback3){
		callback3();
	}
	
 }

function submitLoginData(){
	submitUserData(function(){
		setgetUserPassword(inputUsername, inputPassword, inputrememberlogin, function(){
			DisplayLoginInformation( function(){
				LoginEvaluation();	
			});	
		});			
	});
}

$("#login_button_submit_customer").click(function(){
	submitLoginData();
});

$("#login_password").on('keydown', function(event){
	if (event.keyCode == 13){
		submitLoginData();
		return false;
	}
});

function LoginEvaluation(){
	if (statusSetUsername[1] == 1){
		setTimeout(function(){		
			window.location.replace("index.html");
		}, 2000);
	}

	else if (statusSetUsername[1] == -1){
		$("#login_username").val('');
		$("#login_password").val('');
		document.getElementById("login_username").focus();
	}
}


//load functions at webpage opening
function startatLoad(){
	loadNavbar();
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
function loadNavbar(){
$(document).ready(function(){
	$("#mainNavbar").load("navbar.html?ver="+sortoutcache.valueOf(), function(){
		$("#navbarlogin").addClass("active");
		$("#navbarlogout").hide();
		$("#navbarFunction").hide();
		$("#navbar_function").hide();
		$("#navbarSet").hide();
		$("#navbar_set").hide();
		$("#navbarHelp").hide();
		$("#navbar_help").hide();
	});
});
}
