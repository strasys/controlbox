<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

if ($adminstatus == true)
{
	$statusFile = fopen("/var/www/tmp/CloudPushservicestatus.txt", "w");
	if ($statusFile == false)
	{
		die ("Error: fopen\"/tmp/CloudPushservicestatus.txt\", \"w\" ");
	}
	elseif ($statusFile)
	{
		switch ($_POST["setrunstopStatus"]){
			case 0:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case 1:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/set/data_cloud/PushCloudDataTransferService.php";
				exec($cmd . " > /dev/null &");
				break;
		}
		
		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->PushDataCloudService = $statusWord;
		$xml->asXML("/var/www/VDF.xml");

	}
}




?>
