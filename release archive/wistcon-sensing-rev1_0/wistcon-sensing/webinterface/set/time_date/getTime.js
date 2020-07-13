/**
 * Program to get and set the time of
 * the strahome controller
 */

sortoutcache = new Date();
var offsetTime;

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

function getXMLData(callback4){
	var getXMLData;
	setgetdata("GET","/timezone.xml",function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var Europe = getXMLData.getElementsByTagName("Europe");
			document.getElementById("timezone_continent").value = "Europe";
			for(i=0;i<(Europe.length);i++){
				var y = document.getElementById("timezone_city");
				var option1 = document.createElement("option");
				option1.text = Europe[i].innerHTML;
				y.options.add(option1);
			}
			
		if (callback4){
			callback4();
			}
		}	
	});
}

function getTimeZone(flag, callback1){
	setgetdata("post","setgetTime.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				var timeZoneSet = JSON.parse(xhttp.responseText);
				document.getElementById('actualtimezone').innerHTML = "Zeitzone: "+timeZoneSet.timezone;
				document.getElementById('actuallocaltime').innerHTML = "lokal Zeit/Datum: "+timeZoneSet.local_time;
				document.getElementById('actualUTCtime').innerHTML = "UTC Zeit/Datum: "+timeZoneSet.UNIX_time;
				var str_ntpserver = timeZoneSet.ntp_server;
				var str_split = str_ntpserver.split("/");
				document.getElementById('ntp_server').innerHTML = "ntp Server: <br>"+str_split[0]+"<br>"+str_split[1]+"<br>"+str_split[2];
				if (callback1){
					callback1(timeZoneSet.timezone);
				}
			}
		},"getsetTimeZone="+flag);
}

function setTimeZone(flag, callback1){
	var continent = document.getElementById('timezone_continent').value;
	var city = document.getElementById('timezone_city').value;
	var timezone = continent+"/"+city;
	setgetdata("post","setgetTime.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				if (callback1){
					callback1();
				}
			}
		},"getsetTimeZone="+flag+"&timezone="+timezone);
}
	
function getSystemTimeDate(callback){
		if (!document.all && !document.getElementById)
		return
		var SystemTime = new Date();
		var clientTime = new Date();
		var sST = new XMLHttpRequest();
		sST.open("post","setgetTime.php", true);
		sST.send(null);
		sST.onreadystatechange = function(){
	    	
	    	if(sST.readyState == 4 && sST.status == 200)
	    	{
	    		var getTime = JSON.parse(sST.responseText); 
	    		var hh = parseInt(getTime.hh);
	    		var mm = parseInt(getTime.mm);
	    		var ss = parseInt(getTime.ss);
	    		var Day = parseInt(getTime.Day);
	    		var Month = parseInt(getTime.Month);
	    		var Year = parseInt(getTime.Year);
	    		SystemTime.setDate(Day);
	    		SystemTime.setMonth(Month-1);
	    		SystemTime.setFullYear(Year);
	    		SystemTime.setHours(hh);
	    		SystemTime.setMinutes(mm);
	    		SystemTime.setSeconds(ss);
	    		var system = SystemTime.getTime();
	    		var client = clientTime.getTime();
	    		offsetTime = client - system;
	    		DisplayTime();
	    		DisplayDate();
	    	}
			if(callback){
			callback();
		}
	
	    }
}

	
	
function DisplayTime(){
		if (!document.all && !document.getElementById)
		return
		timeElement=document.getElementById("curTime");
		var clientTime = new Date();
		clientTime.setTime(clientTime.getTime() - offsetTime);
		timeElement.innerHTML=clientTime.toLocaleTimeString();
		t = setTimeout(function(){DisplayTime()}, 1000);
		}
	
	
function DisplayDate(){
		if (!document.all && !document.getElementById)
		return
		dateElement=document.getElementById("curDate");
		var clientDate = new Date();
		clientDate.setTime(clientDate.getTime() - offsetTime);
		dateElement.innerHTML=clientDate.toLocaleDateString();
		}

		
		var sST;
		   
	    
function setSystemTime()
	    { 
	    var hh = document.getElementById("inputhh").value;
	    var mm = document.getElementById("inputmm").value;
	    var ss = document.getElementById("inputss").value;
	   	sST = new XMLHttpRequest();
	    sST.open("post","setgetTime.php", true);
	    sST.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    sST.send("td=t&hh="+hh+"&mm="+mm+"&ss="+ss);
	    sST.onreadystatechange = auswerten; 
	    } 
	    
	   
function auswerten()
	    {
	      if(sST.readyState == 4 && sST.status == 200)
	        {
	    	getSystemTimeDate();
	        }
	    }
	    
	    
function setSystemDate()
	    { 
	    var Day = document.getElementById("inputDD").value;
	    var Month = document.getElementById("inputMM").value;
	    var Year = document.getElementById("inputYY").value;
	    Year = Year - 2000;
	   	sST = new XMLHttpRequest();
	    sST.open("post","setgetTime.php", true);
	    sST.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    sST.send("td=d&Day="+Day+"&Month="+Month+"&Year=" + Year);
	    sST.onreadystatechange = auswerten; 
	    } 
	    
	    
function auswerten()
	    {
	      if(sST.readyState == 4 && sST.status == 200)
	        {
	    	  getSystemTimeDate();
	        }
	    }
	    
function setSelectMenues(min, max, idName){
	    	for(i=min; i <= max; i++){
	    	var x = document.getElementById(idName);
	    	var option = document.createElement("option");
	    	option.text = i;
	    	x.options.add(option);
	    	}
	    }

function showhide_at_load(callback){
	$("#ntp_timezone_set").hide();
	$("#RTC_time").hide();
	$("#RTC_date").hide();
	if(callback){
		callback();
	}
}
	    
function startatLoad(){
	showhide_at_load(function(){
	    	loadNavbar(function(){
			getXMLData(function(){
				getTimeZone(1, function(){
					getSystemTimeDate();
				});
			});
		});
	});	
} 
		window.onload=startatLoad;
		
		 $(document).ready(function(){
		  	  $("#showSetSystemTime").click(function(){
		  	    $("#timeDiv").load("setTime.html", function(){
		  	    setSelectMenues(0, 23, "inputhh");
		    	setSelectMenues(0, 59, "inputmm");
		    	setSelectMenues(0, 59, "inputss");  
		    	$("#showSetSystemTime").hide();
		  	    });
		  	  });
		  	});
		 
		 $(document).ready(function(){
		  	  $("#showSetSystemDate").click(function(){
		  		 $("#dateDiv").load("setDate.html", function(){
				  setSelectMenues(1, 31, "inputDD");
				  setSelectMenues(1, 12, "inputMM");
				  setSelectMenues(2010, 2025, "inputYY");
				  $("#showSetSystemDate").hide();
				 });
		  	  });
		 });
		 
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
    $("#Button_show_settimezone").click(function(){
        $("#ntp_timezone_set").toggle(function(){
		getTimeZone(1, function(str_timezone){
			var str_res = str_timezone.split("/");
			document.getElementById("timezone_city").value = str_res[1];	
		});
	});
    });
});

$("#Button_set_timezone").click(function(){
	$("<div class=\"loader pos-rel\"></div>").appendTo("#ntp_timezone_set .page-header");
	setTimeZone(0, function(){
		getTimeZone(1);
		$("#ntp_timezone_set .page-header div.loader").remove();
	});	
});

$("#Button_refresh_time").click(function(){
	getTimeZone(1);
});
