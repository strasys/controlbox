<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

unset($arr);

if (isset($_POST["getAnalogVal"])){
	if (($_POST["getAnalogVal"] == 'g') && $adminstatus)
	{
		for ($i=0; $i<4; $i++){

			$channel = $i;
			exec(" /usr/lib/cgi-bin/AINOUThandler g I $channel", $output);
		}
		$arr = array(	'INvalue1' => $output[0],
				'INvalue2' => $output[1],
				'INvalue3' => $output[2],
				'INvalue4' => $output[3],
				'loginstatus' => $loginstatus,
				'adminstatus' => $adminstatus
			);
		echo json_encode($arr);
	}
}
if (isset($_POST["setTextFlag"])){
	if (($_POST["setTextFlag"] == '1') && $adminstatus){
		$xml=simplexml_load_file("/var/www/VDF.xml") or die ("Error: Cannot create object");
		for($i=0; $i<4; $i++){
			$xml->AIN[$i]->AINName = $_POST["AINText".(string)$i];
		}
		echo $xml->asXML("/var/www/VDF.xml");	
	}
}

?>
