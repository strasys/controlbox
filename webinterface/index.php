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
include_once ('/var/www/hw_classes/GPIO.inc.php');
include_once ('/var/www/hw_classes/HUMIDITY.inc.php');
include_once '/var/www/hw_classes/FIFOPuffering/PT1000FIFO.inc.php';

/* values do be displayed for pool with solar heater
 * PT1000 1 - 4: Becken, Luft, Rücklauf, Solar
 * Digi OUT: 1 - 5: Pumpe, Mischer, Frischwasser, Poolbeleuchtung, sonstiges
 * Digi In: 1 - 2: Schwimmer, Mischer heizen
 * Status: Automatikbetrieb - Gesamtanlage 
 * Status: Automatikbetrieb: Filtern, nachspeisen, Solar
 */

	$PT1000ex1 = new PT1000;
	$PT1000FIFO = new PT1000FIFO;
 /* 
	$PoolTemp = $PT1000ex1->getPT1000round05(0,1);
	$AirTemp = $PT1000ex1->getPT1000round05(1,1);
	$BackwaterTemp = $PT1000ex1->getPT1000round05(2,1);
	$SolarTemp = $PT1000ex1->getPT1000round05(3,1);
*/	
	$PoolTemp = $PT1000FIFO->getPT1000(0);
	$AirTemp = $PT1000FIFO->getPT1000(1);
	$BackwaterTemp = $PT1000FIFO->getPT1000(2);
	$SolarTemp = $PT1000FIFO->getPT1000(3);
	
	$GPIOhandler = new GPIO;
	$GPIOin = $GPIOhandler->getIn();
	$GPIOout = $GPIOhandler->getOut();


	$arr = array (
	    'PoolTemp' => $PoolTemp,
		'AirTemp' => $AirTemp,
	    'BackwaterTemp' => $BackwaterTemp,
	    'SolarTemp' => $SolarTemp,
	    'GPIOin' => $GPIOin,
	    'GPIOout' => $GPIOout,
	);


	echo json_encode($arr);


?>
