<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
unset($runstop);


//$getLoginStatus = "g";
unset($arr);
$get = "g";
$set = "s";

if (isset($_POST['getLoginStatus'])){
    if ($_POST['getLoginStatus'] == $get)
    {
        $arr = array(	'loginstatus' => $loginstatus ,
            'adminstatus' => $adminstatus 
            );
        echo json_encode($arr);
    }
}

if (isset($_POST['setgetDNSserviceStatus'])){
if ($_POST['setgetDNSserviceStatus'] == $get)
{
	$statusFile = fopen("/var/www/tmp/DNSservicestatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/var/www/tmp/DNSservicestatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		$statusWord = "stop";
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($statusFile);
	}
	
	switch ($statusWord){
		case "stop":
			$runstop = 0;
			break;
		case "run":
			$runstop = 1; 
			break;
	}
	$arr = array(
	    'runstop' => $runstop
	);
	echo json_encode($arr);
}

if (($_POST['setgetDNSserviceStatus'] == $set) && ($adminstatus == true))
{
	$statusFile = fopen("/var/www/tmp/DNSservicestatus.txt", "w");
	if ($statusFile == false)
	{
		die ("Error: fopen\"/tmp/DNSservicestatus.txt\", \"w\" ");
	}
	elseif ($statusFile)
	{
	    switch ($_POST['setrunstopStatus']){
			case 0:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case 1:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/set/parameter/DNS_Service/DNSservicegetIP.php";
				exec($cmd . " > /dev/null &");
				break;
		}
		
		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->DNSService = $statusWord;
		$xml->asXML("/var/www/VDF.xml");

	}
	$arr = array(
	    'runstop' => $runstop
	);
	echo json_encode($arr);
}
}

?>
