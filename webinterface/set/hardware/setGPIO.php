<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

$ausgabe;
$arr;
$ButtonFlag = 0;
$InputFlag = 0;
unset($ausgabe);
unset($arr);
unset($ButtonText);
unset($InputText);
$g = "g";
$s = "s";
$I = "i";
$O = "o";
$Bf = 1;
$If = 1;

if (isset($_POST["setgetGPIO"])){

	if (($_POST["setgetGPIO"] == $g) && $loginstatus && ($_POST["InOut"] == $O)){
			exec("flock /tmp/flockGPIOhander_020 /usr/lib/cgi-bin/GPIOhandler_020 g O", $ausgabe);
			
			$arr = array(	'OUT1' => $ausgabe[0],
					'OUT2' => $ausgabe[1],
					'OUT3' => $ausgabe[2],
					'OUT4' => $ausgabe[3],
					'OUT5' => $ausgabe[4],
					'OUT6' => $ausgabe[5],
					'OUT7' => $ausgabe[6],
					'OUT8' => $ausgabe[7],
					'OUT9' => $ausgabe[8],
					'OUT10' => $ausgabe[9],
					'OUT11' => $ausgabe[10],
					'OUT12' => $ausgabe[11],
					'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
				);
			echo json_encode($arr);

	}
	
	if (($_POST["setgetGPIO"] == $g) && $loginstatus && ($_POST["InOut"] == $I)){
			exec("flock /tmp/flockGPIOhander_020 /usr/lib/cgi-bin/GPIOhandler_020 g I", $ausgabe);
			
			$arr = array(	'IN1' => $ausgabe[0],
					'IN2' => $ausgabe[1],
					'IN3' => $ausgabe[2],
					'IN4' => $ausgabe[3],
					'IN5' => $ausgabe[4],
					'IN6' => $ausgabe[5],
					'IN7' => $ausgabe[6],
					'IN8' => $ausgabe[7],
					'IN9' => $ausgabe[8],
					'IN10' => $ausgabe[9],
					'IN11' => $ausgabe[10],
					'IN12' => $ausgabe[11],
					'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
				);

			echo json_encode($arr);
	}
	
	
	if (($_POST["setgetGPIO"] == $s) && $loginstatus){
			$num = $_POST["GPIOnum"];
			$val = $_POST["GPIOvalue"];
			exec("flock /tmp/flockGPIOhander_020 /usr/lib/cgi-bin/GPIOhandler_020 s $num $val", $ausgabe);
	}
}
	if (isset($_POST["ButtonFlag"])){	
		if (($_POST["ButtonFlag"] == $Bf) && $adminstatus){
			$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");

			$ButtonText = array( 	0 => $_POST["ButtonText0"],
				1 => $_POST["ButtonText1"],
				2 => $_POST["ButtonText2"],
				3 => $_POST["ButtonText3"],
				4 => $_POST["ButtonText4"],
				5 => $_POST["ButtonText5"],
				6 => $_POST["ButtonText6"],
				7 => $_POST["ButtonText7"],
				8 => $_POST["ButtonText8"],
				9 => $_POST["ButtonText9"],
				10 => $_POST["ButtonText10"],
				11 => $_POST["ButtonText11"]
				 );

			for ($i=0; $i<12; $i++){
			$xml->GPIOOUT[$i]->OutputName = $ButtonText[$i];
			}
			echo $xml->asXML("/var/www/VDF.xml");
		}
	}
	if (isset($_POST["InputFlag"])){
		if (($_POST["InputFlag"] == $If) && $adminstatus){
			$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
			$InputText = array( 	0 => $_POST["InputText0"],
				1 => $_POST["InputText1"],
				2 => $_POST["InputText2"],
				3 => $_POST["InputText3"],
				4 => $_POST["InputText4"],
				5 => $_POST["InputText5"],
				6 => $_POST["InputText6"],
				7 => $_POST["InputText7"],
				8 => $_POST["InputText8"],
				9 => $_POST["InputText9"],
				10 => $_POST["InputText10"],
				11 => $_POST["InputText11"]
			);

			for ($i=0; $i<12; $i++){
			$xml->GPIOIN[$i]->InputName = $InputText[$i];
			}
			echo $xml->asXML("/var/www/VDF.xml");
		}
	}
	 
if ($loginstatus == false){
	$arr = array(	'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
				);
	echo json_encode($arr);
}


?>
