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

	$deviceIDval = trim(getDeviceID());
	unset ($data_string, $data);

	$data = array(
		'deviceID' => $deviceIDval
		);
	$data_string="";
	foreach($data as $key=>$value) 
	{
	 $data_string = $data_string.'&'.$key.'='.$value; 
	}
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://www.strasys.at/registration/getRegistrationStatus.php');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_POST, count($data));
	//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	$return = curl_exec($ch);
	curl_close($ch);
	DatabaseRegistrationStatus_return($return);

function DatabaseRegistrationStatus_return($return){

	$returnData = explode("&", $return);
	$returnDataValues = array();
	for ($i=0;$i<9;$i++){
		$temp = explode(":", $returnData[$i]);
		$returnDataValues[$i] = $temp[1];
	}

	$returnDataFinal = array(
		'registrationstatus' => $returnDataValues[0],
		'productexist' => $returnDataValues[1],
		'accountstatus' => $returnDataValues[7],
		'email' => $returnDataValues[6],
		'gender' => $returnDataValues[3],
		'firstname' => $returnDataValues[4],
		'familyname' => $returnDataValues[5],
		'userID' => $returnDataValues[2],
		'productname' => $returnDataValues[8]
	);

	echo json_encode($returnDataFinal);
}

function getDeviceID (){
	exec("flock /tmp/flockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 192 64", $deviceID);
	$deviceIDinfo = trim($deviceID[0]);
	return $deviceIDinfo;
}

function writeRegXML($email, $username){
	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	$xml->Owner[0]-> email = $email;
	$xml->Owner[0]-> userName = $username;
	$xml->asXML("/var/www/VDF.xml");
}
?>
