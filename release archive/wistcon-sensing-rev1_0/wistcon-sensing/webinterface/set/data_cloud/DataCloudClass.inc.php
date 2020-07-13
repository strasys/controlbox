<?php
/*
 * 1. Get data from VDF.xml 
 * 2. Fetch data value.
 * 3. Multiply with correction value
 */

include_once("/var/www/hw_classes/AIN.inc.php");
include_once("/var/www/hw_classes/AOUT.inc.php");
include_once("/var/www/hw_classes/GPIO.inc.php");
include_once("/var/www/hw_classes/PT1000.inc.php");
include_once("/var/www/hw_classes/EEPROM.inc.php");
include_once("/var/www/hw_classes/HUMIDITY.inc.php");
header("Content-Type: text/html; charset=utf-8");

class DataCloudClass
{
//provides Data as an array()
function getXMLData()
{
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$n = $xml->data_cloud[0]->datatocloud->count();
	$data = $xml->data_cloud[0];
	$data_array = array();
	$variable_array = array("type","ext","meteringID","time_interval","unit","factor","timestamp");
	$data_split_array = array();


	for ($i=0;$i<$n;$i++){
		$string = $data->datatocloud[$i];
		$string_parts = explode(":", $string);
		$sn = 7;
		for ($s=0;$s<$sn;$s++){
			if($s<6){
				$data_split_array[$variable_array[$s]] = trim($string_parts[$s]);
			} else {
				//set inital timestamp
				$date = new DateTime();
				//$_SERVER['REQUEST_TIME'];
				$timestamp = $date->getTimestamp();
				$data_split_array[$variable_array[$s]] = $timestamp;
			}
		}

		$data_array[$i] = $data_split_array;
		unset($data_split_array);
	}

	return $data_array;	
}

//checks the timestamp and fetches the data-value

function getDatatoSend($type, $ext, $metering_ID, $time_interval, $unit, $factor, $timelastsend, $DeviceID){
	
	$timestamp_now = time();
	//echo $timestamp_now."<br>";
	$diff_time = $timestamp_now - $timelastsend;
	$time_interval_seconds = $time_interval * 60;
	//echo $diff_time."<br>";
	if ($diff_time >= $time_interval_seconds)
	{
		$type_split = explode("_",$type);
	
		$PT1000 = new PT1000();
		$AIN = new AIN();
		$GPIO = new GPIO();
		$AOUT = new AOUT();
		$HUMIDITY = new HUMIDITY();

		switch (trim($type_split[0])){
		case "DigiOUT":
			$value_metering = $GPIO->getOutSingle($type_split[1]);
			break;
		case "DigiIN":
			$value_metering = $GPIO->getInSingle($type_split[1]);
			break;
		case "AIN":
			$value_metering = $AIN->getAIN($type_split[1], $ext);
			$value_metering = $value_metering * $factor;
			break;
		case "AOUT":
			$value_metering = $AOUT->getAOUT($type_split[1], $ext);
			$value_metering = $value_metering * $factor;
			break;
		case "PT1000":
			$value_metering = $PT1000->getPT1000($type_split[1], $ext);
			$value_metering = $value_metering * $factor;
			break;
		case "HUMIDITY":
			if($type_split[1] == 0){ 
				$value_metering = $HUMIDITY->getHUMIDITY($ext);
				$value_metering = $value_metering * $factor;
			}
			else if ($type_split[1] == 1){
				$value_metering = $HUMIDITY->getTemperature_C($ext);
				$value_metering = $value_metering * $factor;
			}
			break;
		}

		$timestamp = time();

		$metering_array = array($DeviceID, $metering_ID, trim($value_metering), $timestamp, $unit);
	} else {
		$metering_array = null;
	}

	return $metering_array;
}

function SendData($Data_array){

	$send_var_array = array("productID", "meteringID", "value_metering", "time_stamp", "unit");
	
	$Num_Data = sizeof($Data_array);

	$data_string='Num_Data='.$Num_Data.'&';
	
	for($i=0;$i<$Num_Data;$i++){
		for($n=0;$n<5;$n++){
			$data_string = $data_string.$send_var_array[$n].$i.'='.$Data_array[$i][$n].'&';
		}
	}
	
	$trimmed = rtrim($data_string, '&');
	//echo $trimmed."<br>";

	//sudo apt-get install php5-curl => needed
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://www.strasys.at/data/dataCloudhandler.php');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_POST, count($data_string));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	$return = curl_exec($ch);
	curl_close($ch);
	return $return;
}

function DatabaseSendData_return($return){

	$returnData = explode(":", $return);
	$returnDataValues = array();
	for ($i=0;$i<2;$i++){
		$temp = explode("=", $returnData[$i]);
		$returnDataValues[$i] = $temp[1];
	}

	$returnDataFinal = array(
		'product_registerID_exist' => $returnDataValues[0],
		'database_write' => $returnDataValues[1]
	);

	return $returnDataFinal;
}

function XMLDataWriteSendStatus($status){
	//status = 1 => write was O.K.
	//status = -1 => write was not O.K.
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->data_cloud_transfer_status[0]->database_write_status[0] = $status;
	$xml->asXML("/var/www/VDF.xml");
}
	
}
?>
