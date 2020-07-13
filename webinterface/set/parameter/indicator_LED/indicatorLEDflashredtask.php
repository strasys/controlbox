<?php
// Gibt an welche PHP-Fehler �berhaupt angezeigt werden
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
// Da man in einem Produktivsystem �blicherweise keine Fehler ausgeben
// will sondern sie nur mitloggen will, bietet es sich an dort die
// Ausgabe der Fehler zu deaktivieren und sie stattdessen in ein Log-File
// schreiben zu lassen
/*
ini_set('display_errors', 0);
ini_set('error_log', '/pfad/zur/logdatei/php_error.log');
*/
include_once ('/var/www/service_classes/indicator_LED_Service.inc.php');

$indicatorLEDtask = new indicator_LED_Service;

$loopstatus = true;
$i=0;
//echo $loopstatus;	
//To lock the service for the user a lock key must be set as well in the password file.
//echo http_build_query($data) . "\n";
while ($loopstatus)
{
	set_time_limit(5);

	$loopstatus = $indicatorLEDtask->getrunstop_flash_LED_red();
	if($loopstatus != false){
		switch ($i){
			case 0: 
				$indicatorLEDtask->setErrorLEDOnOff('red', 1);
				$i=1;
				break;
			case 1:
				$indicatorLEDtask->setErrorLEDOnOff('red', 0);
				$i=0;
		}
	}
	sleep(1);		
		
}

?>
