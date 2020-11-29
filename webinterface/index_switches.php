<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
//include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/hw_classes/GPIO.inc.php');

/* values do be displayed for pool with solar heater
 * PT1000 1 - 4: Becken, Luft, Rücklauf, Solar
 * Digi OUT: 1 - 5: Pumpe, Mischer, Frischwasser, Poolbeleuchtung, sonstiges
 * Digi In: 1 - 2: Schwimmer, Mischer heizen
 * Status: Automatikbetrieb - Gesamtanlage 
 * Status: Automatikbetrieb: Filtern, nachspeisen, Solar
 */
	
	$GPIOhandler = new GPIO;
    //ButtonType = DigiOutput
	if($_POST["ButtonType"] == 'DigiOutput'){
	    if($GPIOhandler->getOutSingle($_POST["num"]) != $_POST["newStatus"]){
	        $GPIOhandler->setOutsingle($_POST["num"], $_POST["newStatus"]);
	    }
	}

	
/*	
	$arr = array (
	    'PoolTemp' => $PoolTemp,
		'AirTemp' => $AirTemp,
	    'BackwaterTemp' => $BackwaterTemp,
	    'SolarTemp' => $SolarTemp,
	    'GPIOin' => $GPIOin,
	    'GPIOout' => $GPIOout
	);

*/
	echo json_encode($GPIOhandler->getOutSingle($_POST["num"]));


?>