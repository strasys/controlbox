<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

	$td;
	$arr;
	unset($td);
	unset($ausgabe);
	unset($arr);
	$td = 0;
	$td = $_POST["td"];
	$hh = $_POST["hh"];
	$mm = $_POST["mm"];
	$ss = $_POST["ss"];
	$Day = $_POST["Day"];
	$Month = $_POST["Month"];
	$Year = $_POST["Year"];
	$t = "t";
	$d = "d";
/*
if($flag)
{
	if ($td == $t){
		exec("flock /tmp/flockRTChandler020 /usr/lib/cgi-bin/RTChandler020 s t $hh $mm $ss", $ausgabe);
		}
	elseif ($td == $d){
		exec("flock /tmp/flockRTChandler020 /usr/lib/cgi-bin/RTChandler020 s d $Day $Month $Year", $ausgabe);
		}
	elseif ($td == 0) {
	//chdir('/usr/lib/cgi-bin');
	exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);	
	}
	
	$arr = array(	'Day' => $ausgabe[0],
			'Month' => $ausgabe[1],
			'Year' => $ausgabe[2],
			'hh' => $ausgabe[3],
			'mm' => $ausgabe[4],
			'ss' => $ausgabe[5],
			'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
	);
}
 */
if (isset($_POST['getsetTimeZone'])){
	if ($_POST['getsetTimeZone'] == 1){
		//get time Zone data from XML
		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$XMLData[0] = (string)($xml->timedate->timezone);
		$XMLData[1] = (string)($xml->timedate->ntpserver);

		$date = new DateTime("now", new DateTimeZone($XMLData[0]));
	//	$date = new DateTime(null);
		$tz = $date->getTimezone();
		$timezone_set = $tz->getName();
		$unix_date = new DateTime("now", new DateTimeZone('UTC'));
		//get actual time
	//	date_default_timezone_set('Europe/Berlin');
		$local_time = $date->format('H:i:s / d.m.Y');
		$unix_time_formated = $unix_date->format('H:i:s / d.m.Y');
		$arr = array( 	'timezone' => $timezone_set,
			'local_time' => $local_time,
			'UNIX_time' => $unix_time_formated,
			'ntp_server' => $XMLData[1]);
		
	}

	else if ($_POST['getsetTimeZone'] == 0){
		include_once('/var/www/set/time_date/setCloudTimeZone.inc.php');
		//set time Zone to cloud
		$setCloudTZ = new setCloudDeviceTimeZone;
		$arr = $setCloudTZ->setTZtoCoud($_POST['timezone']);
		//set time Zone data to XML
		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->timedate->timezone = $_POST['timezone'];
		$xml->asXML("/var/www/VDF.xml");		
	}
}
	echo json_encode($arr);
?>
