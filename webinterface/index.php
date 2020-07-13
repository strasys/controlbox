<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
//include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/hw_classes/PT1000.inc.php');
include_once ('/var/www/hw_classes/HUMIDITY.inc.php');


	//$PT1000ex1 = new PT1000;
	$humidityex1 = new HUMIDITY;

	$humidity_val_ex1 = $humidityex1->getHUMIDITY(1);
	$humidity_temp_val_ex1 = $humidityex1->getTemperature_C(1);

	//$TEMPERATURE_val1 = $PT1000ex1->getPT1000(0,1);
	//$TEMPERATURE_val2= $PT1000ex1->getPT1000(1,1);

	$arr = array ('humidity1' => $humidity_val_ex1,
		'humidity_temp1' => $humidity_temp_val_ex1,
		//'temp1' => $TEMPERATURE_val1,
		//'temp2' => $TEMPERATURE_val2
	);


	echo json_encode($arr);


?>
