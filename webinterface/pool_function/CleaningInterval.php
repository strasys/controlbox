<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');


if($loginstatus != true){
    $arr = array(
        'loginstatus' => $loginstatus,
        'adminstatus' => $adminstatus
    );
    echo json_encode($arr);
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

if(isset($_POST["setNewTimeperiode"])){
    // Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&setNewTimeperiode='true'
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    // print_r($xml);

    $xml->CleaningSetting->addChild("CleaningInterval");
    $xml->CleaningSetting->CleaningInterval->Start = $_POST["Start"];
    $xml->CleaningSetting->CleaningInterval->Stop = $_POST["Stop"];
    $xml->CleaningSetting->CleaningInterval->Periode = $_POST["Periode"];
    
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
}

if(isset($_POST["ChangeTimeperiode"])){
    //"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&Number="+Number+"&ChangeTimeperiode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    //print_r($xml);

    $xml->CleaningSetting->CleaningInterval[intval($_POST["Number"])]->Start = $_POST["Start"];
    $xml->CleaningSetting->CleaningInterval[intval($_POST["Number"])]->Stop = $_POST["Stop"];
    $xml->CleaningSetting->CleaningInterval[intval($_POST["Number"])]->Periode = $_POST["Periode"];

    writeinascendingorder($xml);
    
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }   
}


if(isset($_POST["AddTimeperiode"])){
    //"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&Number="+Number+"&AddTimeperiode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    //print_r($xml);

    $NoTimerSetting = count($xml->CleaningSetting->CleaningInterval);
    $xml->CleaningSetting->CleaningInterval[$NoTimerSetting]->Start = $_POST["Start"];
    $xml->CleaningSetting->CleaningInterval[$NoTimerSetting]->Stop = $_POST["Stop"];
    $xml->CleaningSetting->CleaningInterval[$NoTimerSetting]->Periode = $_POST["Periode"];

    writeinascendingorder($xml);
    
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
}

if(isset($_POST["DeleteTimeperiode"])){
    //"Start="+StartTime+"&Number="+Number+"&DeleteTimeperiode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    //print_r($xml);
    //search OutputNumber and feedback <OutputTimer> Number

    $NoTimerSetting = count($xml->CleaningSetting->CleaningInterval);
    for($j=0;$j<$NoTimerSetting;$j++){
        if($xml->CleaningSetting->CleaningInterval[$j]->Start[0] == $_POST["Start"]){
            unset($xml->CleaningSetting->CleaningInterval[$j]);
            break;
        }
    }

    //print_r($xml);
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
}

if(isset($_POST["writeMode"])){
    //"Mode="+Mode+"&OutputNo="+OutputNumber+"&writeMode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");

    $xml->CleaningSetting->OperationMode[0] = $_POST["Mode"];
    
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
}

function writeinascendingorder($xml){
    $arrTimerSettingforsorting = array();
    $arrTimerSetting = array();
    $NoTimerSetting = count($xml->CleaningSetting->CleaningInterval);
    
    for ($j=0;$j<$NoTimerSetting;$j++){
        $arrTimerSettingforsorting[$j] = strtotime($xml->CleaningSetting->CleaningInterval[$j]->Start);
        $arrTimerSetting[$j] = array(
            'Start' => (array) $xml->CleaningSetting->CleaningInterval[$j]->Start[0],
            'Stop' => (array) $xml->CleaningSetting->CleaningInterval[$j]->Stop[0],
            'Periode' => (array) $xml->CleaningSetting->CleaningInterval[$j]->Periode[0]
        );
    }
    
    asort($arrTimerSettingforsorting);
    // print_r($arrTimerSettingforsorting);
    
    $arrkeys = array_keys($arrTimerSettingforsorting);
    // print_r($arrkeys);
    // print_r($arrTimerSetting);
    
    //bring it to asscending order
    for($k=0;$k<$NoTimerSetting;$k++){
        $x = $arrkeys[$k];
        $xml->CleaningSetting->CleaningInterval[$k]->Start = $arrTimerSetting[$x]['Start'][0];
        $xml->CleaningSetting->CleaningInterval[$k]->Stop = $arrTimerSetting[$x]['Stop'][0];
        $xml->CleaningSetting->CleaningInterval[$k]->Periode = $arrTimerSetting[$x]['Periode'][0];
    }
}
?>
