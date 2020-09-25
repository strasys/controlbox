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
   // Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&OutputNo="+OutputNumber+"&setNewTimeperiode='true'
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
   // print_r($xml);
    //search OutputNumber and feedback <OutputTimer> Number
    $NoOutputTimer = count($xml->TimerControl->OutputTimer);
    for($i=0;$i<$NoOutputTimer;$i++){
        if($xml->TimerControl->OutputTimer[$i]->Number == $_POST["OutputNo"]){
            $xml->TimerControl->OutputTimer[$i]->addChild("TimerSetting");
            $xml->TimerControl->OutputTimer[$i]->TimerSetting->Start = $_POST["Start"];
            $xml->TimerControl->OutputTimer[$i]->TimerSetting->Stop = $_POST["Stop"];
            $xml->TimerControl->OutputTimer[$i]->TimerSetting->Periode = $_POST["Periode"];
        }
    }
    
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
}

if(isset($_POST["ChangeTimeperiode"])){
    //"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&OutputNo="+OutputNumber+"&Number="+Number+"&ChangeTimeperiode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    //print_r($xml);
    //search OutputNumber and feedback <OutputTimer> Number
    $NoOutputTimer = count($xml->TimerControl->OutputTimer);
    for($i=0;$i<$NoOutputTimer;$i++){
        if($xml->TimerControl->OutputTimer[$i]->Number == $_POST["OutputNo"]){
            $xml->TimerControl->OutputTimer[$i]->TimerSetting[intval($_POST["Number"])]->Start = $_POST["Start"];
            $xml->TimerControl->OutputTimer[$i]->TimerSetting[intval($_POST["Number"])]->Stop = $_POST["Stop"];
            $xml->TimerControl->OutputTimer[$i]->TimerSetting[intval($_POST["Number"])]->Periode = $_POST["Periode"];
           
            $counter = $i;
            break;
        }
    }

    writeinascendingorder($xml,$counter);
   
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
   
}


if(isset($_POST["AddTimeperiode"])){
 //"Start="+StartTime+"&Stop="+StopTime+"&Periode="+timePeriode+"&OutputNo="+OutputNumber+"&Number="+Number+"&AddTimeperiode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    //print_r($xml);
    //search OutputNumber and feedback <OutputTimer> Number
    $NoOutputTimer = count($xml->TimerControl->OutputTimer);
    for($i=0;$i<$NoOutputTimer;$i++){
        if($xml->TimerControl->OutputTimer[$i]->Number == $_POST["OutputNo"]){
            $NoTimerSetting = count($xml->TimerControl->OutputTimer[$i]->TimerSetting);
            $xml->TimerControl->OutputTimer[$i]->TimerSetting[$NoTimerSetting]->Start = $_POST["Start"];
            $xml->TimerControl->OutputTimer[$i]->TimerSetting[$NoTimerSetting]->Stop = $_POST["Stop"];
            $xml->TimerControl->OutputTimer[$i]->TimerSetting[$NoTimerSetting]->Periode = $_POST["Periode"];
            
            $counter = $i;
            break;
        }
    }
    
    writeinascendingorder($xml,$counter);
    
    if($xml->asXML("/var/www/VDF.xml") == 1){
        $arr = array('write' => 'success');
        echo json_encode($arr);
    }
}

if(isset($_POST["DeleteTimeperiode"])){
//"Start="+StartTime+"&OutputNo="+OutputNumber+"&Number="+Number+"&DeleteTimeperiode='true'"
    $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    //print_r($xml);
    //search OutputNumber and feedback <OutputTimer> Number
    $NoOutputTimer = count($xml->TimerControl->OutputTimer);
    for($i=0;$i<$NoOutputTimer;$i++){
        if($xml->TimerControl->OutputTimer[$i]->Number == $_POST["OutputNo"]){
            $NoTimerSetting = count($xml->TimerControl->OutputTimer[$i]->TimerSetting);
            for($j=0;$j<$NoTimerSetting;$j++){
                if($xml->TimerControl->OutputTimer[$i]->TimerSetting[$j]->Start == $_POST["Start"]){
                    unset($xml->TimerControl->OutputTimer[$i]->TimerSetting[$j]);
                    break;
                }
            }
              //  $counter = $i;
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
    //search OutputNumber and write new mode
    $NoOutputTimer = count($xml->TimerControl->OutputTimer);
    for($i=0;$i<$NoOutputTimer;$i++){
        if($xml->TimerControl->OutputTimer[$i]->Number == $_POST["OutputNo"]){
            $xml->TimerControl->OutputTimer[$i]->operationMode[0] = $_POST["Mode"];
            break;
        }
    }
	   
	   if($xml->asXML("/var/www/VDF.xml") == 1){
	       $arr = array('write' => 'success');
	       echo json_encode($arr);
	   }
}

function writeinascendingorder($xml,$counter){
    $arrTimerSettingforsorting = array();
    $arrTimerSetting = array();
    $NoTimerSetting = count($xml->TimerControl->OutputTimer[$counter]->TimerSetting);
    
    for ($j=0;$j<$NoTimerSetting;$j++){
        $arrTimerSettingforsorting[$j] = strtotime($xml->TimerControl->OutputTimer[$counter]->TimerSetting[$j]->Start);
        $arrTimerSetting[$j] = array(
            'Start' => (array) $xml->TimerControl->OutputTimer[$counter]->TimerSetting[$j]->Start[0],
            'Stop' => (array) $xml->TimerControl->OutputTimer[$counter]->TimerSetting[$j]->Stop[0],
            'Periode' => (array) $xml->TimerControl->OutputTimer[$counter]->TimerSetting[$j]->Periode[0]
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
        $xml->TimerControl->OutputTimer[$counter]->TimerSetting[$k]->Start = $arrTimerSetting[$x]['Start'][0];
        $xml->TimerControl->OutputTimer[$counter]->TimerSetting[$k]->Stop = $arrTimerSetting[$x]['Stop'][0];
        $xml->TimerControl->OutputTimer[$counter]->TimerSetting[$k]->Periode = $arrTimerSetting[$x]['Periode'][0];
    }
}
?>
