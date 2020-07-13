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
$merker = -1;
//echo $loopstatus;	
//To lock the service for the user a lock key must be set as well in the password file.
//echo http_build_query($data) . "\n";
while ($loopstatus)
{

	$loopstatus = $indicatorLEDtask->getrunstop();

	set_time_limit(5);

	//echo 'loopstatus 2 = '.$loopstatus."<br>";
	//check if Ethernet is connected to the Internet
	$etherNetconnectionEnabled = $indicatorLEDtask->getEthernetConnectedStatus();
	//echo "etherNetconnectionEnabled: ".$etherNetconnectionEnabled;
	$databaseWriteStatus = $indicatorLEDtask->getwistconDatabaseWriteStatus();
	//logic LEDstatus
	$LEDstatus = 0;
	if ($etherNetconnectionEnabled == false) {$LEDstatus = 1;}
	if (($etherNetconnectionEnabled == true) && ($databaseWriteStatus == false)) {$LEDstatus = 2;}	

	switch($LEDstatus) {
		case 1:
			//flash red LED
			if($LEDstatus != $merker){
				$indicatorLEDtask->setErrorLEDOnOff('red', 0);
				$indicatorLEDtask->setErrorLEDOnOff('blue', 0);
				$indicatorLEDtask->setrunstop_flash_LED_redblue(0);	
				$indicatorLEDtask->setrunstop_flash_LED_red(1);
			}	
			break;
		case 2:
			//flash red / blue LED
			if($LEDstatus != $merker){
				$indicatorLEDtask->setErrorLEDOnOff('red', 0);
				$indicatorLEDtask->setErrorLEDOnOff('blue', 0);
				$indicatorLEDtask->setrunstop_flash_LED_red(0);	
				$indicatorLEDtask->setrunstop_flash_LED_redblue(1);
			}		
			break;
		default:
			if($LEDstatus != $merker){
				$indicatorLEDtask->setErrorLEDOnOff('red', 0);
				$indicatorLEDtask->setrunstop_flash_LED_redblue(0);
				$indicatorLEDtask->setrunstop_flash_LED_red(0);		
				$indicatorLEDtask->setErrorLEDOnOff('blue', 1);	
			}	
			
	}
	$merker = $LEDstatus;
		

	sleep(5);
	if($loopstatus == false){
		$indicatorLEDtask->setErrorLEDOnOff('red', 0);
		$indicatorLEDtask->setErrorLEDOnOff('blue', 0);
		$indicatorLEDtask->setrunstop_flash_LED_redblue(0);
		$indicatorLEDtask->setrunstop_flash_LED_red(0);
	}


}

?>
