<?php
// Gibt an welche PHP-Fehler �berhaupt angezeigt werden
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
// Da man in einem Produktivsystem �blicherweise keine Fehler ausgeben
// will sondern sie nur mitloggen will, bietet es sich an dort die
// Ausgabe der Fehler zu deaktivieren und sie stattdessen in ein Log-File
// schreiben zu lassen
/*
ini_set('display_errors', 0);
ini_set('error_log', '/pfad/zur/logdatei/php_error.log');
*/

include_once '/var/www/hw_classes/PT1000.inc.php';
include_once '/var/www/hw_classes/FIFOPuffering/FIFOPufferingloopcontrol.inc.php';
$PT1000 = new PT1000();
$loopcontrol = new FIFOBufferingloopcontrol();

$loopstatusTask = $loopcontrol->runstopFIFOPufferingTask();

while($loopstatusTask){
    
    
    
    $loopstatusTask = $loopcontrol->runstopFIFOPufferingTask();
    
    if($loopcontrol->runstopFIFOPufferingPT1000()){
        $statusFileDir = "/var/www/tmp/PT1000FIFOPuffer.txt";
        if(!file_exists($statusFileDir)){
            $statusFile = fopen($statusFileDir, "w"); 
        } else {
            $statusFile = fopen($statusFileDir, "r+");
        }
        $PT1000_0 = $PT1000->getPT1000round05(0,1);
        $PT1000_1 = $PT1000->getPT1000round05(1,1);
        $PT1000_2 = $PT1000->getPT1000round05(2,1);
        $PT1000_3 = $PT1000->getPT1000round05(3,1);
   
        fwrite($statusFile, $PT1000_0."\n\r");
        fwrite($statusFile, $PT1000_1."\n\r");
        fwrite($statusFile, $PT1000_2."\n\r");
        fwrite($statusFile, $PT1000_3."\n\r");
        fclose($statusFile);   
    }
    
    sleep(1);
  
}

?>