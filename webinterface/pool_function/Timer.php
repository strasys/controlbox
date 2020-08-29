<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');


if($loginstatus != true){
    exit;
}
//get Log status
if(isset($_POST["getLogData"])){
    if ($_POST["getLogData"] == 'g'){
        $arr = array(
            'loginstatus' => $loginstatus,
            'adminstatus' => $adminstatus
        );
    echo json_encode($arr);
    }
}

if(isset($_POST["getUTCTimstampfromString"])){
    $arr = array ('UTCtimestamp' => strtotime($_POST["getUTCTimstampfromString"]));
    echo json_encode($arr);
}

if(isset($_POST["setTimerMode"])){
    if (($_POST["setTimerMode"] == 's') && ($adminstatus)){
	   $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	   $xml->TimerControl[0]->operationMode = $_POST["TimerMode"];
	   echo $xml->asXML("/var/www/VDF.xml");
    }
}

if(isset($_POST["setCleanTime"])){
    if (($_POST["setCleanTime"] == 's') && ($adminstatus)){
	   $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
	   $i = intval($_POST["CleanInterval"]);
	   $xml->CleaningInterval[$i]->Start = $_POST["StartTime"];
	   $xml->CleaningInterval[$i]->Stop = $_POST["StopTime"];
	   $xml->CleaningInterval[$i]->Periode = $_POST["CleanIntervalPeriode"];
	   echo $xml->asXML("/var/www/VDF.xml");
    }
}

?>
