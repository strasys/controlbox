<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

$arr;
$output;
unset($PT1000Text);
unset($output);
unset($arr);
//$setgetPT1000handler = $_POST["setgetPT1000handler"];
//$setPT1000NameFlag = $_POST["setPT1000NameFlag"];
//$PTFlag = 1;


//get temperature from all channels
if (isset($_POST["setgetPT1000handler"])){ 
	if (($_POST["setgetPT1000handler"] == 'g') && ($loginstatus)){
		$num = $_POST["PT1000ext"];	
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g 0 $num", $output);
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g 1 $num", $output);

		transfer_javascript($output[0], $output[1], $loginstatus, $adminstatus);
	}
}

if (isset($_POST["setPT1000NameFlag"])){
	if (($_POST["setPT1000NameFlag"] == 1) && ($adminstatus)){
		$PT1000Text = array(
			0 => $_POST["PT1000Text0"],
			1 => $_POST["PT1000Text1"]
		);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		for ($i=0; $i<2; $i++){
			$xml->PT1000[$i]->$_POST["PT1000ext"] = $PT1000Text[$i];
		}
		echo $xml->asXML("/var/www/VDF.xml");
	}
}

if (isset($_POST["getXMLData"])){
	if (($_POST["getXMLData"] == 1) && ($adminstatus)){
		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$Name = "PT1000Name".$_POST["PT1000ext"];
		for ($i=0; $i<16; $i++){
			if (isset($xml->PT1000[$i]->$Name)){
				$XMLData[] = (string)($xml->PT1000[$i]->$Name);
			}
		}
	echo json_encode($XMLData);
	}
}

function transfer_javascript($temperature11, $temperature12, $loginstatus, $adminstatus)	
{
	$arr = array( 'temperature11' => $temperature11,
			'temperature12' => $temperature12,
			'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
				);
	
	echo json_encode($arr);
}

?>
