/*
 * Program to Register the product for a user
 *   
 * 01.01.2018
 * Johannes Strasser
 * 
 * www.strasys.at
 */

var sortoutcache = new Date();
var email;
var username;

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

//Check if session is activ
function getloginstatus(callback1){
	getData("post","../../userLogStatus.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
		var getLogData = JSON.parse(xhttp.responseText); 
		
		LogData = [
				(getLogData.loginstatus),
				(getLogData.adminstatus)
		 	  ];
			if (callback1){
				callback1();
			}
		}
	});		
}
		
// Register owner user at wistcon - server and start verification process
function RegisterOwnerUser(gender, firstName_str, FamilyName_str, street_str, number_str, PLZ_str, City_str, Country_str, email_str, password_str, callback3){	
	getData("post","newdeviceOwnerRegistration.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getRegisterData = JSON.parse(xhttp.responseText);
			/*
			getRegisterData:
				'product_registered'
				'product_registerID_exist'
				'accountstatus'
				'verykeysend'
				'database_write'
				'email'
				'gender'
				'firstname'
				'familyname'
			*/
			if(callback3){
				callback3(getRegisterData);
			}
		}
	},
	"gender="+gender+
	"&firstName="+firstName_str+
	"&familyName="+FamilyName_str+
	"&street="+street_str+
	"&number="+number_str+
	"&PLZ="+PLZ_str+
	"&City="+City_str+
	"&Country="+Country_str+
	"&email="+email_str+
	"&password="+password_str
	);
}

//Register new device with existing wistcon cloud account
function RegisterNewProduct_existingAccount(email, password, callback){
	getData("post","newProductRegistration_client.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getRegisterData = JSON.parse(xhttp.responseText);
			/*
			getRegisterData:
				'product_registered'
				'product_registerID_exist'
				'accountlogin'
				'accountstatus'
				'database_write'
				'email'
				'gender'
				'firstname'
				'familyname'
				'productname'
			*/
			if(callback){
				callback(getRegisterData);
			}
		}
	},
	"email="+email+
	"&password="+password
	);
}

function startRegistration_existingAccount(){
	var email = document.getElementById("login_username").value;
	var password = document.getElementById("login_password").value;
	$("#reg_form_owner_start").hide();
	$("<div class=\"loader pos-rel\"></div>").appendTo("#idDeviceOwnerRegistration");
	RegisterNewProduct_existingAccount(email, password, function(registerData){
		if((registerData.product_registerID_exist == -1) || (registerData.product_registered == -1)){
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("<div id=\"fatalerror\"><h3 style=\"color:red;\"><strong>Schwerwiegender Fehler!</strong></h3>"+
			"<p><strong>Die Registrierung ist fehlgeschlagen!<br>"+
			"<br>"+
			"<p><strong>Bitte wenden Sie sich an den wistcon Service!</strong></p>"+
			"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");			
		}
		else if (registerData.accountlogin == -1) {
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("#login_username").val('');
			$("#login_password").val('');
			$("#reg_form_owner_start").show();
			DisplayLoginInformation(-1);
		}
		else if (registerData.database_write == -1){
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("<div id=\"fatalerror\"><h3 style=\"color:red;\"><strong>Datenbank Schreibfehler!</strong></h3>"+
			"<p><strong>Bei der Registrierung ist ein Fehler aufgetreten.!<br>"+
			"Bitte starten Sie die Registrierung nach einem erneuten Logout / Login erneurt!</strong></p>"+
			"<br>"+
			"<p><strong>Tritt das Problem erneut auf, kontaktieren Sie bitte Ihren wistcon Service!</strong></p>"+
			"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");		
		}
		else {
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("<div id=\"successRegistration\"><h3 style=\"color:green;\"><strong>Produkt erfolgreich registriert!</strong></h3>"+
			"<p><strong>Dieses Produkt wurde für folgenden Benutzer registriert:</strong></p>"+
			"<p><strong>"+registerData.gender+" "+registerData.firstname+" "+registerData.familyname+"</strong></p>"+
			"<p> e-Mail Adresse: <strong>"+registerData.email+"</strong></p>"+
			"<p> Klarname Gerät: <strong>"+registerData.productname+"</strong></p>"+
			"<br>"+
			"<p>Sie können nun auch für dieses Gerät die wistcon Cloud Dienste nutzen!</p>"+
			"<br>"+
			"<p>Besten Dank!<br><br>"+
			"Ihr wistcon Team</p>"+	
			"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
		}	
	});
}

//Alert information
function DisplayLoginInformation(statusCustomerLogin, callback3){
	$(window).scrollTop(0);
	switch (statusCustomerLogin){
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

//

// request new e-mail verification code
function requestNewemailVerificationCode(callback){
	getData("post","deviceOwnerRegistrationVerification.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			getNewVeryData = JSON.parse(xhttp.responseText);
			var verykeysend = getNewVeryData.verykeysend;
			var email = getNewVeryData.email;			
			if(callback){
				callback(verykeysend, email);
			}
		}
	},"progkey=reqVery");
}

function startNewAccountVerification(){
	$("#reverification").remove();
	$("<div class=\"loader pos-rel\"></div>").appendTo("#idDeviceOwnerRegistration");
	requestNewemailVerificationCode(function(verykeysend, email){
		if ((verykeysend == -1) && (email == "")){
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("<div id=\"fatalerrorreverificaton\"><h3 style=\"color:red;\"><strong>Schwerwiegender Fehler!</strong></h3>"+
			"<p><strong>Die Datenbank Informationen sind nicht konsistent!<br>"+
			"Starten Sie die Registrierung nach einem erneuten Logout / Login erneurt!</strong></p>"+
			"<br>"+
			"<p><strong>Tritt das Problem erneut auf kontaktieren Sie bitte Ihren Wistcon Service!</strong></p>"+
			"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
		}
		else if ((verykeysend == -1) && (email != "")){
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("<div id=\"errorreverificaton\"><h3 style=\"color:red;\"><strong>Es ist ein Fehler aufgetreten!</strong></h3>"+
			"<p><strong>Beim Versand des Aktivierungs E-Mails ist ein Fehler aufgetreten!<br>"+
			"Bitte starten Sie die Verifizierung erneut!</strong></p>"+
			"<br>"+
			"<p><strong>Tritt das Problem erneut auf kontaktieren Sie bitte Ihren Wistcon Service!</strong></p>"+
			"<br"+	
			"<input class=\"btn btn-success btn-block\" type=\"button\" onclick=\"startNewAccountVerification()\" value=\"e-Mail Verifizierung\" >"+
			"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
		}
		else if ((verykeysend == 1) && (email != "")){
			$("#idDeviceOwnerRegistration div.loader").remove();
			$("<div id=\"successverification\"><h3 style=\"color:green;\"><strong>Verifizierungs e-mail erfolgreich versandt!</strong></h3>"+
			"<p><strong>Wir haben Ihnen eine Account Aktivierungs e-mail an <strong>"+email+"</strong> gesendet.<br>"+
			"Bitte bestätigen Sie diesen über den im E-Mail angehängten link innerhalb von 24h!</strong></p>"+
			"<br>"+
			"<p>Achtung! Es kommt vor, dass das E-Mail in Ihrem Spam Ordner landedt!</p>"+
			"<p>Haben Sie das e-mail versehentlich gelöscht, können Sie über den Button \"e-Mail Verifizierung\" ein Neues Aktivierungs e-mail anfordern.</p>"+
			"<br>"+	
			"<input class=\"btn btn-success btn-block\" type=\"button\" onclick=\"startNewAccountVerification()\" value=\"e-Mail Verifizierung\">"+
			"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
		}

	});
}

function OpenWindowRegistrationwithoutAccount(){
	emptyinputfields(function(){
		$("#reg_form_owner_start").hide();
		$("#reg_form_owner_register").show();
		$("#SubmitProductReg").show();
		setSelectMenuesValues(function(){
		
		});
	});	
}


function setSelectMenuesValues(){

	var country_list = new Array("Deutschland", "Österreich", "Schweiz");
	for (i=0;i<3;i++){
		var option = document.createElement("option");
		option.text = country_list[i];
		document.getElementById("Country").options.add(option);
	}
	$("<div class='col-xs-4'><br>"+
	"<input class='btn btn-info' type='button' onclick='SubmitNewProductReg()' value='Daten Senden'>"+
	"</div>").appendTo("#reg_form_owner_register");
}

function emptyinputfields(callback){
	$("#firstName").val('');
	$("#FamilyName").val('');
	$("#street").val('');
	$("#email").val('');
	$("#number").val('');
	$("#PLZ").val('');
	$("#City").val('');
	$("#password1").val('');
	$("#password2").val('');

	if(callback){
		callback();
	}
}

function passwordstrength(){
	var password_str = document.getElementById("password1");
	var password_span = document.getElementById("password1_span");
	var password_patt = new RegExp(/^(?=.*[a-z])(?=.*[\_\?\!\#])(?=.*[A-Z]).{6,15}$/);
	var password_str_res = password_patt.test(password_str.value);

	$("#password1_div").removeClass();
	$("#password1_div").addClass("form-group");
	$("#password1_span").removeClass();

	if (password_str_res){
		$("#password1_div").removeClass();
		$("#password1_div").addClass("input-group has-feedback has-success");
		$("#password1_span").removeClass();
		$("#password1_span").addClass("glyphicon glyphicon-ok form-control-feedback");

	}else{
		$("#password1_div").removeClass();
		$("#password1_div").addClass("input-group has-feedback has-error");
		$("#password1_span").removeClass();
		$("#password1_span").addClass("glyphicon glyphicon-remove form-control-feedback");
	}
}

function tooltip_password(status){
/*	$("#password1").tooltip({
		title:'Das Passwort muss mindestens eine Großbuchstaben<br>einen Kleinbuchstaben enthalten',
		placement:'top',
		html:'true'
	});
	*/
       		if (status == '1'){
          		$("#password1").popover({
			title:'<strong>Passwort Anforderung:</strong>',
			content: '6 - 15 Zeichen<br>min. ein Großbuchstabe [A-Z]<br> min. ein Kleinbuchstabe [a-z]<br>min. eine Zahl [0-9]<br>min. eines folgender Sonderzeichen<br>_ ? ! #',
			placement:'top',
			html:'true',
			});
			$("#password1").popover('show');
		}
		else if (status == '0'){
			$("#password1").popover('hide');
		}
}

function password_repeat(){
	var password1_str = document.getElementById("password1");
	var password2_str = document.getElementById("password2");

	if (password1_str.value == password2_str.value){
		$("#password2_div").removeClass();
		$("#password2_div").addClass("form-group has-feedback has-success");
		$("#password2_span").removeClass();
		$("#password2_span").addClass("glyphicon glyphicon-ok form-control-feedback");

	}else{
		$("#password2_div").removeClass();
		$("#password2_div").addClass("form-group has-feedback has-error");
		$("#password2_span").removeClass();
		$("#password2_span").addClass("glyphicon glyphicon-remove form-control-feedback");
	}

}

function showpassword_text(){
	var className = $("#password1_i").attr('class');
	if (className == 'glyphicon glyphicon-eye-open'){
		$("#password1_i").removeClass();
		$("#password1_i").addClass("glyphicon glyphicon-eye-close");
		document.getElementById("password1").type = "text";
	}
	else if (className == 'glyphicon glyphicon-eye-close'){
		$("#password1_i").removeClass();
		$("#password1_i").addClass("glyphicon glyphicon-eye-open");
		document.getElementById("password1").type = "password";
	}
}

//Registration information => after pressing the submit button
function SubmitNewProductReg()
{
	checkProductRegistrationEntry(function(error_flag_registration, gender, firstName_str, FamilyName_str, street_str, number_str, PLZ_str, City_str, Country_str, email_str, password1_str){
		if (error_flag_registration == 0){
			$("#reg_form_owner_register").remove();
			$("<div class=\"loader pos-rel\"></div>").appendTo("#idDeviceOwnerRegistration");
			RegisterOwnerUser(gender, firstName_str, FamilyName_str, street_str, number_str, PLZ_str, City_str, Country_str, email_str, password1_str, function(getRegisterData){
			
			$("#reg_form_owner_start").hide();
			$("#idDeviceOwnerRegistration div.loader").remove();
			//check if an error occured
			/*	'product_registered' => data will not be evaluated again
				'product_registerID_exist' => data will not be evaluated again
				'verykeysend' => needs to be checked
				'database_write' => needs to be checked
			*/

			if (getRegisterData.database_write == -1){
				$("<div id=\"errorRegistration\"><h3 style=\"color:red;\"><strong>Es ist ein Fehler aufgetreten!</strong></h3>"+
				"<p><strong>Beim Anlegen Ihrer Benutzerdaten ist ein Fehler aufgetreten.<br>"+
				"Starten Sie die Registrierung zu einem späteren Zeitpunkt erneurt!</strong></p>"+
				"<br>"+
				"<p><strong>Trit das Problem erneut auf, kontaktieren Sie bitte Ihr wistcon Team!</strong></p>"+
				"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
			}	
			else if (getRegisterData.verykeysend == -1){
				$("<div id=\"errorRegistration\"><h3 style=\"color:red;\"><strong>Es ist ein Fehler aufgetreten!</strong></h3>"+
				"<p><strong>Beim Versenden der E-Mail Bestätigung ist ein Fehler aufgetreten!<br>"+
				"Starten Sie die Registrierung zu einem spätern Zeitpunkt erneut.</strong></p>"+
				"<br>"+
				"<p><strong>Trit das Problem weiterhin auf, kontaktieren Sie bitte Ihr wistcon Team!</strong></p>"+
				"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
			}
			else if (getRegisterData.accountstatus == -1){
				$("<div id=\"successRegistration\"><h3 style=\"color:green;\"><strong>Verifizierungs e-mail erfolgreich versandt!</strong></h3>"+
				"<p><strong>Wir haben Ihnen eine Account Aktivierungs E-Mail an <strong>"+getRegisterData.email+"</strong> gesendet.<br>"+
				getRegisterData.gender+" "+getRegisterData.firstname+" "+getRegisterData.familyname+",<br>"+
				"mit der Bestätigung Ihrer E-Mail können Sie die Cloud Dienste von wistcon nutzen.<br>"+
				"Aus Sicherheitsgründen, bitten wir Sie die Bestätigung innerhalb von 24h durchzuführen.</p>"+
				"<br>"+
				"<p>Achtung! Es kommt vor, dass das e-mail in Ihrem Spam Ordner landedt!</p>"+
				"<p>Haben Sie das e-mail versehentlich gelöscht, können Sie über den Button \"e-Mail Verifizierung\" ein Neues Aktivierungs E-Mail anfordern.</p>"+
				"<br>"+
				"<p>Besten Dank!<br><br>"+
				"Ihr wistcon Team</p>"+	
				"<br>"+
				"<input class=\"btn btn-success btn-block\" type=\"button\" onclick=\"startNewAccountVerification()\" value=\"e-Mail Verifizierung\">"+
				"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
			}
		});
		}
	});
}

function checkProductRegistrationEntry(callback){
	var error_flag_registration = 0;

	//reset input "has-feedback" options
	$("#firstName_div").removeClass();
	$("#firstName_div").addClass("form-group");
	$("#firstName_span").removeClass();

	$("#FamilyName_div").removeClass();
	$("#FamilyName_div").addClass("form-group");
	$("#FamilyName_span").removeClass();

	$("#street_div").removeClass();
	$("#street_div").addClass("form-group");
	$("#street_span").removeClass();

	$("#email_div").removeClass();
	$("#email_div").addClass("form-group");
	$("#email_span").removeClass();
	
	$("#number_div").removeClass();
	$("#number_div").addClass("form-group");
	$("#number_span").removeClass();

	$("#PLZ_div").removeClass();
	$("#PLZ_div").addClass("form-group");
	$("#PLZ_span").removeClass();

	$("#City_div").removeClass();
	$("#City_div").addClass("form-group");
	$("#City_span").removeClass();

	$("#password1_div").removeClass();
	$("#password1_div").addClass("form-group");
	$("#password1_span").removeClass();

	$("#password2_div").removeClass();
	$("#password2_div").addClass("form-group");
	$("#password2_span").removeClass();

	// read input values
	var gender_MR_radio = document.getElementById("radioMR");
	var gender_MS_radio = document.getElementById("radioMS");
	var gender = "";
	var email_str = document.getElementById("email");
	var firstName_str = document.getElementById("firstName");
	var FamilyName_str = document.getElementById("FamilyName");
	var street_str = document.getElementById("street");
	var number_str = document.getElementById("number");
	var PLZ_str = document.getElementById("PLZ");
	var City_str = document.getElementById("City");
	var Country_str = document.getElementById("Country");
	var password1_str = document.getElementById("password1");
	var password2_str = document.getElementById("password2");
	
	//Check gender
	if (gender_MR_radio.checked){
		gender = gender_MR_radio.value;
	}
	if (gender_MS_radio.checked){
		gender = gender_MS_radio.value;
	}
	
	//Check e-mail - mandatory
	var email_patt = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	var email_str_res = email_patt.test(email_str.value);

	if ((email_str_res == false) || (email_str.value == "")){
		$("#email_div").removeClass();
		$("#email_div").addClass("form-group has-feedback has-error");
		$("#email_span").removeClass();
		$("#email_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check First Name - mandatory
	var firstName_patt = new RegExp(/^[A-Za-zäöüÄÖÜß\´\`\'\-\ ]{2,20}$/);
	var firstName_str_res = firstName_patt.test(firstName_str.value);
	if((firstName_str.value == "")||(firstName_str_res == false)){
		$("#firstName_div").removeClass();
		$("#firstName_div").addClass("form-group has-feedback has-error");
		$("#firstName_span").removeClass();
		$("#firstName_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check Family Name - mandatory
	var FamilyName_patt = new RegExp(/^[A-Za-zäöüÄÖÜß\'\-\`\´\ ]{2,30}$/);
	var FamilyName_str_res = FamilyName_patt.test(FamilyName_str.value);
	if((FamilyName_str.value == "")||(FamilyName_str_res == false)){
		$("#FamilyName_div").removeClass();
		$("#FamilyName_div").addClass("form-group has-feedback has-error");
		$("#FamilyName_span").removeClass();
		$("#FamilyName_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check street
	var street_patt = new RegExp(/^[A-Za-zäöüÄÖÜß.\'\-\`\´\ ]{2,30}$/);
	var street_str_res = street_patt.test(street_str.value);
	if (!(street_str.value == "") && (street_str_res == false)){
		$("#street_div").removeClass();
		$("#street_div").addClass("form-group has-feedback has-error");
		$("#street_span").removeClass();
		$("#street_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check number
	var number_patt = new RegExp(/^[0-9]+[a-zA-Z]?$/);
	var number_str_res = number_patt.test(number_str.value);
	if (!(number_str.value == "") && (number_str_res == false)){
		$("#number_div").removeClass();
		$("#number_div").addClass("form-group has-feedback has-error");
		$("#number_span").removeClass();
		$("#number_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check PLZ
	var PLZ_patt = new RegExp(/^[0-9]{4,5}$/);
	var PLZ_str_res = PLZ_patt.test(PLZ_str.value);
	if (!(number_str.value == "") && (number_str_res == false)){
		$("#PLZ_div").removeClass();
		$("#PLZ_div").addClass("form-group has-feedback has-error");
		$("#PLZ_span").removeClass();
		$("#PLZ_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}
	
	//Check City - mandatory
	var City_patt = new RegExp(/^[A-Za-zäöüÄÖÜß.\'\-\`\´\ ]{2,20}$/);
	var City_str_res = City_patt.test(City_str.value);
	if ((City_str.value == "") || (City_str_res == false)){
		$("#City_div").removeClass();
		$("#City_div").addClass("form-group has-feedback has-error");
		$("#City_span").removeClass();
		$("#City_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check password input
	var password_patt = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[\_\?\!\#])(?=.*[A-Z]).{6,15}$/);
	var password_str_res = password_patt.test(password1_str.value);
	
	if ((password_str_res = false) || (password1_str.value != password2_str.value) || (password1_str.value == "")){
		$("#password1_div").removeClass();
		$("#password1_div").addClass("input-group has-feedback has-error");
		$("#password1_span").removeClass();
		$("#password1_span").addClass("glyphicon glyphicon-remove form-control-feedback");

		$("#password2_div").removeClass();
		$("#password2_div").addClass("form-group has-feedback has-error");
		$("#password2_span").removeClass();
		$("#password2_span").addClass("glyphicon glyphicon-remove form-control-feedback");

		error_flag_registration = -1;
	}

	if (callback){
		callback(error_flag_registration, gender, firstName_str.value, FamilyName_str.value, street_str.value, number_str.value, PLZ_str.value, City_str.value, Country_str.value, email_str.value, password1_str.value);
	}
}


// Submit data to server => checkRegistrationStatus()
function checkRegistrationStatus(callback){
	getData("post","deviceOwnerRegistrationStatus.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var DataStatus = JSON.parse(xhttp.responseText);		
			if(callback){
				callback(DataStatus);
			}
		}
	});
}

//show and hide
function showandhide(callback){	
	$("#idDeviceOwnerRegistration div.panel-body").hide();
	$("#reg_form_owner_start").hide();
	$("#reg_form_owner_register").hide();

	if (callback){
		callback();
	}
}

function relocation_wistcon_cloud(url){
	var win = window.open(url, '_blank');
	win.focus();
}

// load functions at webpage opening
function startatLoad(){
showandhide(function(){
	loadNavbar(function(){
		//Show loader
		$("<div class=\"loader pos-rel\"></div>").appendTo("#idDeviceOwnerRegistration");
		checkRegistrationStatus(function(DataStatus){ 
			//Remove loader
			$("#idDeviceOwnerRegistration div.loader").remove();
			if((DataStatus.registrationstatus == 1) && (DataStatus.productexist == 1)){
				if (DataStatus.accountstatus == 1){
					$("<div id=\"registered\"><h3 style=\"color:green;\"><strong>Produkt ist registriert!</strong></h3>"+
					"<br>"+
					"<p><strong>Eigentümer: "+DataStatus.gender+" "+DataStatus.firstname+" "+DataStatus.familyname+"</strong></p>"+
					"<p><strong>wistcon Cloud Anmeldeinformationen:</strong></p>"+
					"<p> e-Mail Adresse / Benutzername: <strong>"+DataStatus.email+"</strong></p>"+
					"<p> Gerätename: <strong>"+DataStatus.productname+"</strong></p>"+
					"<br>"+
					"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
					$("#idDeviceOwnerRegistration div.panel-body").show();
				}
				else if (DataStatus.accountstatus == -1){
					$("<div id=\"reverification\"><h3 style=\"color:red;\"><strong>Benutzer - Verifizierung ausstehend!</strong></h3>"+
					"<p><strong>Bitte schließen Sie die Account Registrierung mit der e-Mail Verifizierung ab!</strong></p>"+
					"<br>"+
					"<p><strong>Dieses Produkt ist für folgenden Benutzer registriert:</strong></p>"+
					"<p><strong>"+DataStatus.gender+" "+DataStatus.firstname+" "+DataStatus.familyname+"</strong></p>"+
					"<p> e-Mail Adresse: <strong>"+DataStatus.email+"</strong></p>"+
					"<p> Klarname Gerät: <strong>"+DataStatus.productname+"</strong></p>"+
					"<br>"+
					"<p>Es ist nur noch ein Schritt zur Freischaltung Ihres Accounts notwendig.</p>"+
					"<p>Über den Butten <strong>\"e-Mail Verifizierung\"</strong> können Sie Ihren Account aktivieren.</p><br>"+
					"<input class=\"btn btn-success btn-block\" type=\"button\" onclick=\"startNewAccountVerification()\" value=\"e-Mail Verifizierung\" >"+
					"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
					$("#idDeviceOwnerRegistration div.panel-body").show();
				}
			      	else if (DataStatus.accountstatus == 0){
					$("<div id=\"reverification\"><h3 style=\"color:orange;\"><strong>Produkt registriert - Zugang zurückgesetzt!</strong></h3>"+
					"<p><strong>Ihr Passwort wurde zurückgesetzt!<br>"+
				        "Bitte reaktivieren Sie Ihr Passwort über die e-mail Freigabe!</strong></p>"+
				        "<p>Hirzu muss der Eigentümer auf der <strong>\"wistcon\"</strong> Webseite beim Login die"+
				        "<strong>\"Passwort - vergessen\"</strong> Routine starten!</p>"+
					"<br>"+
					"<p><strong>Dieses Produkt ist für folgenden Benutzer registriert:</strong><p>"+
					"<p><strong>"+DataStatus.gender+" "+DataStatus.firstname+" "+DataStatus.familyname+"</strong></p>"+
					"<p> e-Mail Adresse: <strong>"+DataStatus.email+"</strong></p>"+
					"<p> Klarname Gerät: <strong>"+DataStatus.productname+"</strong></p>"+
					"<br>"+
					"<p>Über den Button <strong>\"Weiterleitung - wistcon Cloud\"</strong> gelangen Sie direkt auf die wistcon Webseite</p><br>"+
					"<input class=\"btn btn-success btn-block\" type=\"button\" onclick=\"relocation_wistcon_cloud('https://www.wistcon.at')\" value=\"Weiterleitung - wistcon Cloud\" >"+
					"</div>").appendTo("#idDeviceOwnerRegistration div.panel-body");
					$("#idDeviceOwnerRegistration div.panel-body").show();
				}	       
			}
			else if ((DataStatus.registrationstatus == -1) && (DataStatus.productexist == 1)){
				$("#reg_form_owner_start").show();
				$("#reg_form_owner_register").hide();
				$("#idDeviceOwnerRegistration div.panel-body").show();
			}
			
			else{
				emptyinputfields(function(){
					$("#reg_form_owner_start").show();
					$("#SubmitProductReg").show();
					$("#idDeviceOwnerRegistration").show();
					setSelectMenuesValues(function(){
					});
				});
			}
		});
	});
});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getloginstatus(function(){
		if (LogData[0])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=2", function(){
					$("#navbarlogin").hide();
					$("#navbarSet").addClass("active");
					$("#navbarSet").show();
					$("#navbar_set span").toggleClass("nav_notactive nav_active")
					$("#reg_form_owner").hide();
					$("#reg_owner_answer_positiv").hide();
					$("#veri_code_div").hide();
					$("#SubmitProductReg").hide();
		
					if (LogData[1] == false)
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
		if (callback1){
			callback1();
		}
	});
}

$("#reg_form_owner_start a").on('click', function(){
	OpenWindowRegistrationwithoutAccount();
});

