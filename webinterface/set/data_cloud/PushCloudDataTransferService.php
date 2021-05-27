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
header("Content-Type: text/html; charset=utf-8");

include_once ('PushCloudloopcontrol.inc.php');
include_once ('DataCloudClass.inc.php');
//add function to get data from XML => datatocloud

$dnsloop = new PushCloudloopcontrol();

$DataCloudClass = new DataCloudClass();

$FetchXMLData = $DataCloudClass->getXMLData();
$NumberofDatasets = sizeof($FetchXMLData);
$EEPROM = new EEPROM();
$DeviceID = $EEPROM->getDeviceID();
$loopstatus = true;

while ($loopstatus){
	$loopstatus = $dnsloop->runstop();

	set_time_limit(10);

	for($i=0;$i<$NumberofDatasets;$i++){
		//SendData array = DeviceID, metering_ID, value_metering, timestamp, unit 
		$SendData = $DataCloudClass->getDatatoSend($FetchXMLData[$i]['type'],
			$FetchXMLData[$i]['ext'],
			$FetchXMLData[$i]['meteringID'],
			$FetchXMLData[$i]['time_interval'],
			$FetchXMLData[$i]['unit'],
			$FetchXMLData[$i]['factor'],
			$FetchXMLData[$i]['timestamp'],
			$DeviceID
		);
		if ($SendData != NULL){
		    //print_r($SendData);
		    //if ($I2C_error_humidity == 1 && $I2C_error_temp == 1){
		    //set timestamp to calculate next push ivent
		    $return = $DataCloudClass->SendDataControlbox($SendData);
		    $return_arr = $DataCloudClass->DatabaseSendData_return($return);
		    $DataCloudClass->XMLDataWriteSendStatus($return_arr['database_write']);
		    $FetchXMLData[$i]['timestamp'] = time();			
		}
	}
 

	sleep(5);

}
?>

