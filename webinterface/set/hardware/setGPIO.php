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
			exec("flock /tmp/flockGPIOhander_controlbox /usr/lib/cgi-bin/GPIOhandler_controlbox g O", $ausgabe);
			
			$arr = array(    'OUT1' => $ausgabe[0],
					         'OUT2' => $ausgabe[1],
					         'OUT3' => $ausgabe[2],
					         'OUT4' => $ausgabe[3],
					         'OUT5' => $ausgabe[4],
					         'loginstatus' => $loginstatus,
					         'adminstatus' => $adminstatus
				);
			echo json_encode($arr);

	}
	
	if (($_POST["setgetGPIO"] == $g) && $loginstatus && ($_POST["InOut"] == $I)){
			exec("flock /tmp/flockGPIOhander_controlbox /usr/lib/cgi-bin/GPIOhandler_controlbox g I", $ausgabe);
			
			$arr = array(	'IN1' => $ausgabe[0],
					'IN2' => $ausgabe[1],
					'IN3' => $ausgabe[2],
					'IN4' => $ausgabe[3],
					'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
				);

			echo json_encode($arr);
	}
	
	
	if (($_POST["setgetGPIO"] == $s) && $loginstatus){
			$num = $_POST["GPIOnum"];
			$val = $_POST["GPIOvalue"];
			exec("flock /tmp/flockGPIOhander_controlbox /usr/lib/cgi-bin/GPIOhandler_controlbox s $num $val", $ausgabe);
	}
}
	if (isset($_POST["ButtonFlag"])){	
		if (($_POST["ButtonFlag"] == $Bf) && $adminstatus){
			$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");

			$ButtonText = array( 	0 => $_POST["ButtonText0"],
				1 => $_POST["ButtonText1"],
				2 => $_POST["ButtonText2"],
				3 => $_POST["ButtonText3"],
				4 => $_POST["ButtonText4"]
				 );

			for ($i=0; $i<5; $i++){
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
				3 => $_POST["InputText3"]
			);

			for ($i=0; $i<4; $i++){
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
