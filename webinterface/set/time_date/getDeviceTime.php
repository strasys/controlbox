<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

if ($loginstatus == false){
    exit('Error: Login expired');
}

	//get time Zone data from XML
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$XMLData[0] = (string)($xml->timedate->timezone);

	$date = new DateTime("now", new DateTimeZone($XMLData[0]));
	//	$date = new DateTime(null);
	$tz = $date->getTimezone();
	$timezone_set = $tz->getName();
	$unix_date = new DateTime("now", new DateTimeZone('UTC'));
	//get actual time
	//	date_default_timezone_set('Europe/Berlin');
	$unix_time_formated = $unix_date->format('Y,m,d,H,i,s');
	$arr = array( 	'timezone' => $timezone_set,
	    'local_time_Y' => $date->format('Y'),
	    'local_time_M' => $date->format('n'),
	    'local_time_D' => $date->format('j'),
	    'local_time_h' => $date->format('G'),
	    'local_time_m' => $date->format('i'),
	    'local_time_s' => $date->format('s'),
			'UNIX_time' => $unix_time_formated);
		
	echo json_encode($arr);
?>