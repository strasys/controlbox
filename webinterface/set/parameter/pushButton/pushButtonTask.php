<?php 
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once "/var/www/hw_classes/GPIO.inc.php";
include_once "/var/www/service_classes/pushButtonService.inc.php";

$DIGI = new GPIO();
$pushButtonService = new pushButtonSensingService();

/*
if($pushButtonService->getrunstopStatus()){
    echo "pushButtonServiceStatus = run <br>";
} else {
    echo "pushButtonServiceStatus = stop <br>";
}
*/

while($pushButtonService->getrunstopStatus()){
    $arrSensingStatus = array();
    $arrSensingStatus =  $pushButtonService->GetSensing();
    
    //Input 2 push Button should switch PoolLight Output4
    if($arrSensingStatus[2] == '1'){
        
        $statusDigiOUT4 = $DIGI->getOutSingle(3);
        if($statusDigiOUT4 == 1){
            $DIGI->setOutsingle(3, 0);
        } elseif ($statusDigiOUT4 == 0){
            $DIGI->setOutsingle(3, 1);
        }
        
        $pushButtonService->SetSensing(2, '0');
    }
    
}

?>