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
//PushButtonStatus=set&GPIONum="+GPIONum
if(isset($_POST["PushButtonStatus"])){
    if ($_POST["PushButtonStatus"] == 'set'){
        if ($_POST["CheckboxStatus"] == 'true'){
            //0 = On
            $PushButtonSetStatus = '0';
        } else {
            $PushButtonSetStatus = 'N';
        }
        
        $PushButtonService->SetSensing($_POST["GPIONum"], $PushButtonSetStatus);        
    } 
    else if($_POST["PushButtonStatus"] == 'get'){
        
        echo json_encode($PushButtonService->GetSensing());
    }
}

if(isset($_POST["setgetStatusPushButtonservice"])){
    
    $statusFileDir = "/var/www/tmp/pushButtonSensingRunStop.txt";
    
    if ($_POST["setgetStatusPushButtonservice"] == 'get')
    {
        if (!file_exists($statusFileDir))
    	{
    		$statusFile = fopen($statusFileDir, "w");
    		fwrite($statusFile, "stop");
    		fclose($statusFile);
    	}
    	
    	$statusFile = fopen($statusFileDir, "r");
        $statusWord = trim(fgets($statusFile, 5));
    	fclose($statusFile);
    	
    	
    	$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
    	$xml->OperationModeDevice[0]->pushButtonSensing = $statusWord;
    	$xml->asXML("/var/www/VDF.xml");
    	
    	echo json_encode($statusWord);
    	exit;
    }

    if ($_POST["setgetStatusPushButtonservice"] == 'set')
    {
        $statusFile = fopen($statusFileDir, "w");
		
		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $_POST["ONOFF"], 5);
		fclose($statusFile);
	
		
		if ($_POST["ONOFF"] == "run")
		{
		    $cma = "php /var/www/set/parameter/pushButton/pushButtonTask.php";
		    exec($cma . " > /dev/null &");
		    
			$cmb = " /usr/lib/cgi-bin/Button_Sensing ". $_POST['loopcycle']; 
			exec($cmb . " > /dev/null &");
		}
	
		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->pushButtonSensing = $_POST["ONOFF"];
		$xml->asXML("/var/www/VDF.xml");
		
		echo json_encode($_POST["ONOFF"]);
    }
}


?>
