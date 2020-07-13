/**
 * user and user rights management
 * 
 * 23.03.2017
 * Johannes Strasser
 * 
 * www.strasys.at
 */

sortoutcache = new Date();
var selecteduser;

function setgetuser(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

 function saveNewUser(Username, Password, Adminright, callback1){
	setgetuser("post","user.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var statusUsernamePassword = JSON.parse(xhttp.responseText); 
		
			statusSetUsername = [(statusUsernamePassword.errorUsername),
						(statusUsernamePassword.loginstatus),
						(statusUsernamePassword.adminstatus)
						];
				if (callback1){
					callback1();
				}
			}
		},"username="+Username+"&password="+Password+"&adminright="+Adminright+"&setget=set");
}

function saveChangedUser(Username, Password, Adminright, LineNumber, callback){
		setgetuser("post","user.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var statusUsernamePassword = JSON.parse(xhttp.responseText); 
				
				statusChangeUsername = [(statusUsernamePassword.errorUsername),
							(statusUsernamePassword.loginstatus),
							(statusUsernamePassword.adminstatus)
							];
					if (callback){
						callback();
					}
				}
			},"username="+Username+"&password="+Password+"&adminright="+Adminright+"&lineNumber="+LineNumber+"&setget=change");		
	
}

function DeleteSelectedUser(LineNumber, callback1){
	setgetuser("post","user.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var statusUsernamePassword = JSON.parse(xhttp.responseText); 
		
			statusDeletUsername = [	(statusUsernamePassword.loginstatus),
						(statusUsernamePassword.adminstatus)
						];
				if (callback1){
					callback1();
				}
			}
		},"setget=delete&lineNumber="+LineNumber);
}


function getloginstatus(callback1){
	setgetuser("post","user.php",function()
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
			},"loginstatus=get");
}

function getuserList(callback1){
	setgetuser("post","user.php",function()
		{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
			userList = JSON.parse(xhttp.responseText);
				
				if (callback1){
					callback1();
				}
			}
	},"setget=get");
}

//Alert information
function DisplayAlertInformation(msg, status, callback3){
	switch (status){
		case 0:
			$("#alert_icon").removeClass();
			$("#alert_icon").addClass("login-icon glyphicon glyphicon-chevron-right");
			$("#alert_text-msg").html(msg);
			$("#alert_msg").removeClass();
			$("#alert_msg").addClass("login-msg");
			break
		case -1:
			$("#alert_icon").removeClass();
			$("#alert_icon").addClass("login-icon glyphicon glyphicon-remove error");
			$("#alert_text-msg").html(msg);
			$("#alert_msg").removeClass();
			$("#alert_msg").addClass("login-msg error");
			break;
		case 1:
			$("#alert_icon").removeClass();
			$("#alert_icon").addClass("login-icon glyphicon glyphicon-ok success");
			$("#alert_text-msg").html(msg);
			$("#alert_msg").removeClass();
			$("#alert_msg").addClass("login-msg success");
			break;
	}

	if (callback3){
		callback3();
	}
	
}


//display user list
function writeuserList(){
	 getuserList(function(){
		 
	//	$("#userlist_head").focus();
		$("<th>Auswahl</th><th>Bentutzer Name</th><th>Rechte</th>").appendTo("#userlist_head");
		var n=0;
		for (i=1;i<((userList[0])-1);i=i+2){
			n++
			$("<tr><td><label><input type=\"radio\" name=\"user\" value=\""+n+"\"></label></td><td>"+userList[i]+"</td><td>"+userList[i+1]+"</td></tr>").appendTo("#userlist_body");
			}	
	});
}

//password rules
function PasswordRuleChecker(password){ 
	var password_patt_Letter = new RegExp(/(?=.*[A-Z])(?=.{1,}[a-z])/);
	var password_patt_special = new RegExp(/(?=.{1,}[\_\?\!\#])/);
	var password_length = password.value.length;
	var password_patt = new RegExp(/^(?=.*[a-z])(?=.*[\_\?\!\#])(?=.*[A-Z]).{6,15}$/);
	var password_str_res_Letter = password_patt_Letter.test(password.value);
	var password_str_res_special = password_patt_special.test(password.value);
	var password_str_res = password_patt.test(password.value);

	this.pwdLength = password_length;
	this.pwdLetter = password_str_res_Letter;
	this.pwdSpecial = password_str_res_special;
	this.pwdStr = password_str_res;
}

//user name rules
function UsernameRuleChecker(username){
	var username_length = username.value.length;
	//Keine umlaute und keine Leerzeichen
	var username_umlaut = new RegExp(/(?=.+[\Ä\ä\Ü\ü\Ö\ö\ß\s])/);
	var username_str_umlaut = username_umlaut.test(username.value);
	
	this.userLength = username_length;
	this.userUmlaut = username_str_umlaut;
}

//view set up at load
function viewatLoad(callback){
	$("#alert_user").hide();
	$("#adduser").hide();
	$("#userlist").hide();
	$("#changeuserlist").hide();
	$("#changepassword_help").hide();
	$("#changeuser_help").hide();
	$("#adduser_help").hide();
	$("#addpassword_help").hide();
	$("#ButtonChangeSelectedUser").prop('disabled', true);
	$("#changepassword1_input").val("");

	if (callback){
		callback();
	}
 }

//load functions at webpage opening
 function startatLoad(){
	 loadNavbar(function(){
		 viewatLoad(function(){
			DisplayAlertInformation("Zum Ändern/Löschen Benutzer selektieren!", 0, function(){
				$("#alert_user").show();
				writeuserList();
			});
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
function loadNavbar(callback){
	getloginstatus(function(){
		if (LogInStatusCheck[0])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=2", function(){
					$("#navbarSet").addClass("active");
					$("#navbar_set span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#userlist").show();
					
					if (LogInStatusCheck[1]==false)
					{
						$("#navbarSet").hide();
						$("#userlist").hide();
					}
				});
			});

			if (callback) {
				callback();
			}
		}
		else
		{
			window.location.replace("/login.html");
		}
	});
}

// select user line
$("#userlist_body").on('change', function(){
	selecteduser = $('input[name=user]:checked', '#userlist_body').val();
	$("#ButtonChangeSelectedUser").prop('disabled', false);
});

// change selected user line
$("#ButtonChangeSelectedUser").on('click', function(){
	$("#userlist").hide();
	var selector = 2 * selecteduser -1;
	$("#inputchangeuser").val(userList[selector]);
	
	if(userList[selector + 1] == 'admin'){
		$("#changeuserright input[value=admin]").prop('checked', true);
	} else {
		$("#changeuserright input[value=user]").prop('checked', true);	
	}
	$("#changeuserlist").show();
	DisplayAlertInformation("\"user\" Daten anpassen", 0, function(){
		$("#alert_user").show();	
	});
});

//user: add user
$("#ButtonaddUser").on('click', function(){
	$("#userlist").hide(function(){
		$("#adduser").show();
		$("#inputadduser").val("");
		$("#addpassword1_input").val("");
		$("#addpassword2_input").val("");
		DisplayAlertInformation("Neuen Benutzer anlegen!", 0, function(){
			$("#alert_user").show();
		});
	});	
});

//user-add: show helper
$("#inputadduser").focusin(function(){
	$("#adduser_help").show();
});

//user-add: inline rule check user
$("#inputadduser").keyup(function(){
	var username = document.getElementById("inputadduser");
	var checkuser = new UsernameRuleChecker(username);	

		if ((checkuser.userLength > 2) && (checkuser.userLength < 11)){
		$("#adduser_help p:nth-child(3)").removeClass();
		$("#adduser_help p:nth-child(3)").addClass("text-success");
		$("#adduser_help p:nth-child(3) span").removeClass();
		$("#adduser_help p:nth-child(3) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#adduser_help p:nth-child(3)").removeClass();
		$("#adduser_help p:nth-child(3)").addClass("text-danger");
		$("#adduser_help p:nth-child(3) span").removeClass();
		$("#adduser_help p:nth-child(3) span").addClass("glyphicon glyphicon-remove");		
	}

	if (checkuser.userUmlaut){
		$("#adduser_help p:nth-child(2)").removeClass();
		$("#adduser_help p:nth-child(2)").addClass("text-danger");
		$("#adduser_help p:nth-child(2) span").removeClass();
		$("#adduser_help p:nth-child(2) span").addClass("glyphicon glyphicon-remove");	
	} else {
		$("#adduser_help p:nth-child(2)").removeClass();
		$("#adduser_help p:nth-child(2)").addClass("text-success");
		$("#adduser_help p:nth-child(2) span").removeClass();
		$("#adduser_help p:nth-child(2) span").addClass("glyphicon glyphicon-ok");
	}	

});

//password-add: show helper
$("#addpassword1_input").focusin(function(){
	$("#addpassword_help").show();
});

//password-add: check inline the password rule
$("#addpassword1_input").keyup(function(){
	var password = document.getElementById("addpassword1_input");
	var checkpwd = new PasswordRuleChecker(password);

	if (checkpwd.pwdLetter){
		$("#addpassword_help p:nth-child(2)").removeClass();
		$("#addpassword_help p:nth-child(2)").addClass("text-success");
		$("#addpassword_help p:nth-child(2) span").removeClass();
		$("#addpassword_help p:nth-child(2) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#addpassword_help p:nth-child(2)").removeClass();
		$("#addpassword_help p:nth-child(2)").addClass("text-danger");
		$("#addpassword_help p:nth-child(2) span").removeClass();
		$("#addpassword_help p:nth-child(2) span").addClass("glyphicon glyphicon-remove");		
	}

	if (checkpwd.pwdSpecial){
		$("#addpassword_help p:nth-child(3)").removeClass();
		$("#addpassword_help p:nth-child(3)").addClass("text-success");
		$("#addpassword_help p:nth-child(3) span").removeClass();
		$("#addpassword_help p:nth-child(3) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#addpassword_help p:nth-child(3)").removeClass();
		$("#addpassword_help p:nth-child(3)").addClass("text-danger");
		$("#addpassword_help p:nth-child(3) span").removeClass();
		$("#addpassword_help p:nth-child(3) span").addClass("glyphicon glyphicon-remove");		
	}
	
	if ((checkpwd.pwdLength > 5) && (checkpwd.pwdLength < 16)){
		$("#addpassword_help p:nth-child(4)").removeClass();
		$("#addpassword_help p:nth-child(4)").addClass("text-success");
		$("#addpassword_help p:nth-child(4) span").removeClass();
		$("#addpassword_help p:nth-child(4) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#addpassword_help p:nth-child(4)").removeClass();
		$("#addpassword_help p:nth-child(4)").addClass("text-danger");
		$("#addpassword_help p:nth-child(4) span").removeClass();
		$("#addpassword_help p:nth-child(4) span").addClass("glyphicon glyphicon-remove");		
	}
	
	// show if entire password is true
	if (checkpwd.pwdStr){
		$("#addpassword1").removeClass();
		$("#addpassword1").addClass("input-group has-feedback has-success");
		$("#addpassword1 span").removeClass();
		$("#addpassword1 span").addClass("glyphicon glyphicon-ok form-control-feedback");
	}	
});

//add - user Password: show password Text
$("#addpassword1 button").click(function(){
	var className = $("i").attr('class');
	if (className == 'glyphicon glyphicon-eye-open'){
		$("i").removeClass();
		$("i").addClass("glyphicon glyphicon-eye-close");
		document.getElementById("addpassword1_input").type = "password";
	}
	else if (className == 'glyphicon glyphicon-eye-close'){
		$("i").removeClass();
		$("i").addClass("glyphicon glyphicon-eye-open");
		document.getElementById("addpassword1_input").type = "text";
	}
});

//user-Name: show helper
$("#inputchangeuser").focusin(function(){
	$("#changeuser_help").show();
});

//user: change text of helper while typing
$("#inputchangeuser").keyup(function(){
	var username = document.getElementById("inputchangeuser");
	var checkuser = new UsernameRuleChecker(username);

	if ((checkuser.userLength > 2) && (checkuser.userLength < 11)){
		$("#changeuser_help p:nth-child(3)").removeClass();
		$("#changeuser_help p:nth-child(3)").addClass("text-success");
		$("#changeuser_help p:nth-child(3) span").removeClass();
		$("#changeuser_help p:nth-child(3) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#changeuser_help p:nth-child(3)").removeClass();
		$("#changeuser_help p:nth-child(3)").addClass("text-danger");
		$("#changeuser_help p:nth-child(3) span").removeClass();
		$("#changeuser_help p:nth-child(3) span").addClass("glyphicon glyphicon-remove");		
	}

	if (checkuser.userUmlaut){
		$("#changeuser_help p:nth-child(2)").removeClass();
		$("#changeuser_help p:nth-child(2)").addClass("text-danger");
		$("#changeuser_help p:nth-child(2) span").removeClass();
		$("#changeuser_help p:nth-child(2) span").addClass("glyphicon glyphicon-remove");	
	} else {
		$("#changeuser_help p:nth-child(2)").removeClass();
		$("#changeuser_help p:nth-child(2)").addClass("text-success");
		$("#changeuser_help p:nth-child(2) span").removeClass();
		$("#changeuser_help p:nth-child(2) span").addClass("glyphicon glyphicon-ok");
	}	
});

//Password: show helper
$("#changepassword1 input").focusin(function(){
	$("#changepassword_help").show();
});

//Password: change text of helper while typing
$("#changepassword1_input").keyup(function(){
	var password = document.getElementById("changepassword1_input");
	var checkpwd = new PasswordRuleChecker(password);

	if (checkpwd.pwdLetter){
		$("#changepassword_help p:nth-child(2)").removeClass();
		$("#changepassword_help p:nth-child(2)").addClass("text-success");
		$("#changepassword_help p:nth-child(2) span").removeClass();
		$("#changepassword_help p:nth-child(2) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#changepassword_help p:nth-child(2)").removeClass();
		$("#changepassword_help p:nth-child(2)").addClass("text-danger");
		$("#changepassword_help p:nth-child(2) span").removeClass();
		$("#changepassword_help p:nth-child(2) span").addClass("glyphicon glyphicon-remove");		
	}

	if (checkpwd.pwdSpecial){
		$("#changepassword_help p:nth-child(3)").removeClass();
		$("#changepassword_help p:nth-child(3)").addClass("text-success");
		$("#changepassword_help p:nth-child(3) span").removeClass();
		$("#changepassword_help p:nth-child(3) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#changepassword_help p:nth-child(3)").removeClass();
		$("#changepassword_help p:nth-child(3)").addClass("text-danger");
		$("#changepassword_help p:nth-child(3) span").removeClass();
		$("#changepassword_help p:nth-child(3) span").addClass("glyphicon glyphicon-remove");		
	}
	
	if ((checkpwd.pwdLength > 5) && (checkpwd.pwdLength < 16)){
		$("#changepassword_help p:nth-child(4)").removeClass();
		$("#changepassword_help p:nth-child(4)").addClass("text-success");
		$("#changepassword_help p:nth-child(4) span").removeClass();
		$("#changepassword_help p:nth-child(4) span").addClass("glyphicon glyphicon-ok");	
	} else {
		$("#changepassword_help p:nth-child(4)").removeClass();
		$("#changepassword_help p:nth-child(4)").addClass("text-danger");
		$("#changepassword_help p:nth-child(4) span").removeClass();
		$("#changepassword_help p:nth-child(4) span").addClass("glyphicon glyphicon-remove");		
	}
	
	// show if entire password is true
	if (checkpwd.pwdStr){
		$("#changepassword1").removeClass();
		$("#changepassword1").addClass("input-group has-feedback has-success");
		$("#changepassword1 span").removeClass();
		$("#changepassword1 span").addClass("glyphicon glyphicon-ok form-control-feedback");
	}
});


//change Password: show password Text
$("#changepassword1 button").click(function(){
	var className = $("i").attr('class');
	if (className == 'glyphicon glyphicon-eye-open'){
		$("i").removeClass();
		$("i").addClass("glyphicon glyphicon-eye-close");
		document.getElementById("changepassword1_input").type = "password";
	}
	else if (className == 'glyphicon glyphicon-eye-close'){
		$("i").removeClass();
		$("i").addClass("glyphicon glyphicon-eye-open");
		document.getElementById("changepassword1_input").type = "text";
	}
});


//Save add - user Data
$("#ButtonSaveNewUser").on('click', function(){
	var flag = true;
	var password = document.getElementById("addpassword1_input");
	var checkpwd = new PasswordRuleChecker(password);
	var password_repeat = document.getElementById("addpassword2_input");
	var username = document.getElementById("inputadduser");
	var checkuser = new UsernameRuleChecker(username);
	var userRight = $("#adduserright input[name=right]:checked").val();
	
	//remove all feedback settings
		$("#addpassword1").removeClass();
		$("#addpassword1").addClass("input-group");
		$("#addpassword1 span").removeClass();

		$("#addpassword2").removeClass();
		$("#addpassword2").addClass("form-group");
		$("#addpassword2 span").removeClass();

		$("#addusername").removeClass();
		$("#addusername").addClass("form-group");
		$("#addusername span").removeClass();


	if ((checkpwd.pwdStr == false) || (password == null)){
		$("#addpassword1").removeClass();
		$("#addpassword1").addClass("input-group has-feedback has-error");
		$("#addpassword1 span").removeClass();
		$("#addpassword1 span").addClass("glyphicon glyphicon-remove form-control-feedback");
		
		flag = false;	
	}
	
	if (password.value != password_repeat.value){
		$("#addpassword2").removeClass();
		$("#addpassword2").addClass("form-group has-feedback has-error");
		$("#addpassword2 span").removeClass();
		$("#addpassword2 span").addClass("glyphicon glyphicon-remove form-control-feedback");

		flag = false;
	}
	
	if ((checkuser.userLength > 10) || (checkuser.userLength < 3) || (checkuser.userUmlaut == true) || (password == null)){
		$("#addusername").removeClass();
		$("#addusername").addClass("form-group has-feedback has-error");
		$("#addusername span").removeClass();
		$("#addusername span").addClass("glyphicon glyphicon-remove form-control-feedback");

		flag = false;
	}

	if (flag == false){
		DisplayAlertInformation("Prüfen Sie Ihre Eingabe!", -1);
	} else {
		saveNewUser(username.value, password.value, userRight, function(){
			if (statusSetUsername[0] == -1){
				DisplayAlertInformation("Benutzername existiert bereits!", -1, function(){
					$("#addusername").removeClass();
					$("#addusername").addClass("form-group has-feedback has-error");
					$("#addusername span").removeClass();
					$("#addusername span").addClass("glyphicon glyphicon-remove form-control-feedback");
					$(window).scrollTop(0);	
				});
			} else if (statusSetUsername[0] == 0){
				$(window).scrollTop(0);
				DisplayAlertInformation("Benutzer erfolgreich gespeichert!", 1, function(){
					setTimeout(function(){
						window.location.replace("user.html");
					},1500);				
				});
			}
		});
	}
});

//Save changed user data and check entry
$("#ButtonChangeUserList").on('click', function(){
	var flag = true;
	var password = document.getElementById("changepassword1_input");
	var checkpwd = new PasswordRuleChecker(password);
	var password_repeat = document.getElementById("changepassword2_input");
	var username = document.getElementById("inputchangeuser");
	var checkuser = new UsernameRuleChecker(username);
	var userRight = $("#changeuserright input[name=changeright]:checked").val();


	//remomve all feedback settings
	$("#changepassword1").removeClass();
	$("#changepassword1").addClass("input-group");
	$("#changepassword1 span").removeClass();

	$("#changepassword2").removeClass();
	$("#changepassword2").addClass("form-group");
	$("#changepassword2 span").removeClass();

	$("#changeusername").removeClass();
	$("#changeusername").addClass("form-group");
	$("#changeusername span").removeClass();

	if ((checkpwd.pwdStr == false) || (password == null)){
		$("#changepassword1").removeClass();
		$("#changepassword1").addClass("input-group has-feedback has-error");
		$("#changepassword1 span").removeClass();
		$("#changepassword1 span").addClass("glyphicon glyphicon-remove form-control-feedback");
		
		flag = false;	
	}
	
	if (password.value != password_repeat.value){
		$("#changepassword2").removeClass();
		$("#changepassword2").addClass("form-group has-feedback has-error");
		$("#changepassword2 span").removeClass();
		$("#changepassword2 span").addClass("glyphicon glyphicon-remove form-control-feedback");

		flag = false;
	}
	
	if ((checkuser.userLength > 10) || (checkuser.userLength < 3) || (checkuser.userUmlaut == true) || (password == null)){
		$("#changeusername").removeClass();
		$("#changeusername").addClass("form-group has-feedback has-error");
		$("#changeusername span").removeClass();
		$("#changeusername span").addClass("glyphicon glyphicon-remove form-control-feedback");
		
		flag = false;
	}

	if (flag == false){
		DisplayAlertInformation("Prüfen Sie Ihre Eingabe!", -1);
	} else {
		saveChangedUser(username.value, password.value, userRight, selecteduser ,function(){
			if (statusChangeUsername[0] == -1){
				DisplayAlertInformation("Prüfen Sie Ihre Eingabe!", -1, function(){
					$("#changeusername").removeClass();
					$("#changeusername").addClass("form-group has-feedback has-error");
					$("#changeusername span").removeClass();
					$("#changeusername span").addClass("glyphicon glyphicon-remove form-control-feedback");
					$(window).scrollTop(0);	
				});
			} else if (statusChangeUsername[0] == 0){
				DisplayAlertInformation("Änderungen erfolgreich verarbeitet!", 1, function(){
					setTimeout(function(){
						window.location.replace("user.html");
					},1500);
				});
			}
		});
	}			
});

$("#ButtonDeletSelectedUser").on('click', function(){
	DeleteSelectedUser(selecteduser, function(){
		$(window).scrollTop(0);
		DisplayAlertInformation("Ausgewählter Benutzer gelöscht!", 1, function(){
			setTimeout(function(){
				window.location.replace("user.html");
			},1500);
		});
	});
});



