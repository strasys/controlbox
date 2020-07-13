<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/hw_classes/HUMIDITY.inc.php');

//get humidity and temperature value
if (isset($_POST["setgetHUMIDITYhandler"])){ 
	if (($_POST["setgetHUMIDITYhandler"] == 'g') && ($loginstatus)){
		$ext = $_POST["HUMIDITYext"];
		$humidity = new HUMIDITY;	
		$humidity_val = $humidity->getHUMIDITY($ext);
		$temperature_val = $humidity->getTemperature_C($ext);

		$arr = array( 'humidity_val' => $humidity_val,
			'temperature_val' => $temperature_val,
			'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
			);
	
		echo json_encode($arr);
	}
}

if (isset($_POST["setHUMIDITYNameFlag"])){
	if (($_POST["setHUMIDITYNameFlag"] == 1) && ($adminstatus)){
		$HUMIDITYText = array(
			0 => $_POST["HUMIDITYText0"],
			1 => $_POST["HUMIDITYText1"]
		);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		for ($i=0; $i<2; $i++){
			$xml->HUMIDITY[$i]->$_POST["HUMIDITYext"] = $HUMIDITYText[$i];
		}
		echo $xml->asXML("/var/www/VDF.xml");
	}
}

if (isset($_POST["getXMLData"])){
	if (($_POST["getXMLData"] == 1) && ($loginstatus)){
		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$Name = "HUMIDITYname".$_POST["HUMIDITYext"];
		for ($i=0; $i<4; $i++){
			if (isset($xml->HUMIDITY[$i]->$Name)){
				$XMLData[] = (string)($xml->HUMIDITY[$i]->$Name);
			}
		}
	echo json_encode($XMLData);
	}
}

?>
