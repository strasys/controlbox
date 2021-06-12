<?php 
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/service_classes/pushButtonService.inc.php');

$PushButtonService = new pushButtonSensingService;


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

if(isset($_POST["setgetFIFOPuffering"])){
    
    $statusFileDir = "/var/www/tmp/".$_POST["PufferID"]."runstopStatus.txt";
    
    if($_POST["setgetFIFOPuffering"] == 's'){
        $arr = array(
            'errorCode' => ""
        );
        if($_POST["CheckboxStatus"] == 'true'){
            $statusWord = "run";
        } else {
            $statusWord = "stop";
        }
        
            $statusFile = fopen($statusFileDir, "w");
            fwrite($statusFile, $statusWord);
            fclose($statusFile);
            if($_POST["PufferID"] == 'FIFOPufferTask' && $_POST["CheckboxStatus"] == 'true'){
                $cmd = "php /var/www/hw_classes/FIFOPuffering/FIFOPufferingTask.php";
                exec($cmd . " > /dev/null &");
            }
       
        $PufferID = $_POST["PufferID"];
        $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
        $xml->FIFOPuffering[0]->$PufferID = $statusWord;
        $xml->asXML("/var/www/VDF.xml");
        
        $arr['errorCode'] = 'setgetFIFOPuffering:success';
        
        echo json_encode($arr);
    }
    
    if($_POST["setgetFIFOPuffering"] == 'g'){
        $arr = array();
        
        $PufferID = explode(",",$_POST["PufferID"]);
        foreach ($PufferID as $ID){
            $statusFileDir = "/var/www/tmp/".$ID."runstopStatus.txt";
            if(!file_exists($statusFileDir)){
                $statusFile = fopen($statusFileDir, "w");
                fwrite($statusFile, "stop");
                fclose($statusFile);
                $arr[$ID] = "stop";
                $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
                $xml->FIFOPuffering[0]->$ID = "stop";
                $xml->asXML("/var/www/VDF.xml");  
            } else {
                $statusFile = fopen($statusFileDir, "r");
                $statusWord = trim(fgets($statusFile, 5));
                fclose($statusFile);
                $arr[$ID] = $statusWord;
            }
        }
        
        //$arr['errorCode'] = 'setgetFIFOPuffering:success';
        
        echo json_encode($arr);
    }
    
}

?>