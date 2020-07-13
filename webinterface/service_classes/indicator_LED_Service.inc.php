<?php
/*
	class indicator_LED_Service
	
	Johannes Strasser
	01.04.2018
	www.wistcon.at
 */

//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once('/var/www/hw_classes/GPIO.inc.php');

class indicator_LED_Service
{
	//get composer Status
	//stop (0) = composer = Automatic mode is off
	//run (1)= composer = Automatic mode is on
	
function getrunstop()
	{
	$statusFile = fopen("/var/www/tmp/indicatorLEDstatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/var/www/tmp/indicatorLEDstatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		//echo "test";
		$runstop = false;
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($statusFile);

	
		switch ($statusWord){
		case "stop":
			$runstop = false;
			break;
		case "run":
			$runstop = true; 
			break;
		}
	}
	return (bool) $runstop;
	}

	//set composer Status
	//status = true => set to run
	//status = false => set to stop
function setrunstop($status)
	{
	$statusFile = fopen("/var/www/tmp/indicatorLEDstatus.txt", "w");
	if ($statusFile == false)
	{
		die ("Error: fopen\"/tmp/indicatorLEDstatus.txt\", \"w\" ");
	}
	elseif ($statusFile)
	{
		switch ($status){
			case 0:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case 1:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/set/parameter/indicator_LED/indicatorLEDServicetask.php";
				exec($cmd . " > /dev/null &");
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->indicatorLED[0] = $statusWord;
		$xml->asXML("/var/www/VDF.xml");
	}
}

function getwistconDatabaseWriteStatus(){
	//get Data from XML VDF.xml
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$database_write_status = $xml->data_cloud_transfer_status[0]->database_write_status;
	if ($database_write_status == -1){
		$DatabaseWriteStatus = false;
	}
	elseif ($database_write_status == 1){
		$DatabaseWriteStatus = true;	
	} else {
		$DatabaseWriteStatus = true;
	}

	return (bool) $DatabaseWriteStatus;
}

function getEthernetConnectedStatus()
{
// $host,$port,$errCode,$errStr,$waitTimeoutInSeconds	
    $connected = fsockopen("www.wistcon.at", 443, $errCode,$errStr,1); 
       //website, port  (try 80 or 443)
    if ($connected){
        $is_conn = true; //action when connected
        fclose($connected);
    }else{
	$is_conn = false; //action in connection failure
    }
    return (bool) $is_conn;

}

function setErrorLEDOnOff($color, $OnOFF){
	$GPIO = new GPIO;
	if($color == 'blue'){
		$GPIO->setOutsingle(12, $OnOFF);
	}
	elseif($color == 'red'){
		$GPIO->setOutsingle(13, $OnOFF);	
	}	
}

	//set composer Status
	//status = true => set to run
	//status = false => set to stop
function setrunstop_flash_LED_red($status)
	{
	$statusFile = fopen("/var/www/tmp/indicatorLEDflashredstatus.txt", "w");
	if ($statusFile == false)
	{
		die ("Error: fopen\"/tmp/indicatorLEDflashredstatus.txt\", \"w\" ");
	}
	elseif ($statusFile)
	{
		switch ($status){
			case 0:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case 1:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/set/parameter/indicator_LED/indicatorLEDflashredtask.php";
				exec($cmd . " > /dev/null &");
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);
	}
}

function getrunstop_flash_LED_red()
	{
	$statusFile = fopen("/var/www/tmp/indicatorLEDflashredstatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/var/www/tmp/indicatorLEDflashredstatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		//echo "test";
		$runstop = false;
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($statusFile);

	
		switch ($statusWord){
		case "stop":
			$runstop = false;
			break;
		case "run":
			$runstop = true; 
			break;
		}
	}
	return (bool) $runstop;
	}

	//set composer Status
	//status = true => set to run
	//status = false => set to stop
function setrunstop_flash_LED_redblue($status)
	{
	$statusFile = fopen("/var/www/tmp/indicatorLEDflashredbluestatus.txt", "w");
	if ($statusFile == false)
	{
		die ("Error: fopen\"/tmp/indicatorLEDflashredbluestatus.txt\", \"w\" ");
	}
	elseif ($statusFile)
	{
		switch ($status){
			case 0:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case 1:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/set/parameter/indicator_LED/indicatorLEDflashredbluetask.php";
				exec($cmd . " > /dev/null &");
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);
	}
}

function getrunstop_flash_LED_redblue()
	{
	$statusFile = fopen("/var/www/tmp/indicatorLEDflashredbluestatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/var/www/tmp/indicatorLEDflashredbluestatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		//echo "test";
		$runstop = false;
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($statusFile);

	
		switch ($statusWord){
		case "stop":
			$runstop = false;
			break;
		case "run":
			$runstop = true; 
			break;
		}
	}
	return (bool) $runstop;
	}


}
?>
