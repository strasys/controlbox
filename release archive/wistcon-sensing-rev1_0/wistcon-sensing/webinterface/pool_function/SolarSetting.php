<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
$arr;
unset($arr);
unset($TempTyp, $TempValue);
$getLogData = $_POST["getLogData"];
$TempValue = $_POST["TempValue"];
$TempTyp = $_POST["TempTyp"];
$get = "g";
$set = "s";
$TempBackWater = "TempBackWater";
$DifferenceONTemp = "DifferenceONTemp";
$DifferenceOFFTemp = "DifferenceOFFTemp";
$SwitchOFFdelay = "SwitchOFFdelay";
$SwitchONdelay = "SwitchONdelay";
$operationMode = "operationMode";

//get Log status
if ($getLogData == $get){
	transfer_javascript($loginstatus, $adminstatus);
}

if (($TempTyp == $TempBackWater) && ($adminstatus)){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->SolarSetting[0]->backWaterTemp = $_POST["TempValue"];
	echo $xml->asXML("/var/www/VDF.xml");
}

if (($TempTyp == $DifferenceONTemp) && ($adminstatus)){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->SolarSetting[0]->diffONTemp = $_POST["TempValue"];
	echo $xml->asXML("/var/www/VDF.xml");
}

if (($TempTyp == $DifferenceOFFTemp) && ($adminstatus)){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->SolarSetting[0]->diffOFFTemp = $_POST["TempValue"];
	echo $xml->asXML("/var/www/VDF.xml");
}

if (($TempTyp == $SwitchOFFdelay) && ($adminstatus)){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->SolarSetting[0]->SwitchOFFdelay = $_POST["TempValue"];
	echo $xml->asXML("/var/www/VDF.xml");
}

if (($TempTyp == $SwitchONdelay) && ($adminstatus)){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->SolarSetting[0]->SwitchONdelay = $_POST["TempValue"];
	echo $xml->asXML("/var/www/VDF.xml");
}

if (($TempTyp == $operationMode) && ($adminstatus)){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->SolarSetting[0]->operationMode = $_POST["TempValue"];
	echo $xml->asXML("/var/www/VDF.xml");
}


function transfer_javascript($loginstatus, $adminstatus)	
{
	$arr = array(
			'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
			);
	
	echo json_encode($arr);
}

?>
