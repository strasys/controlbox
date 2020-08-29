<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/service_classes/indicator_LED_Service.inc.php');

$webstatusclass = new indicator_LED_Service;

$webstatus = $webstatusclass->getEthernetConnectedStatus();

if ($webstatus == true){
    $statusword = '1';
} elseif ($webstatus == false){
    $statusword = '0';
}

function writestatus($statusWord, $statusFile){
    fwrite($statusFile,'',2);
    rewind($statusFile);
    fwrite($statusFile, $statusWord, 2);
    fclose($statusFile);
}

$statusFile = fopen("/var/www/tmp/webaccessStatus.txt", "w");
if ($statusFile == false)
{
    die ("The webaccessStatus.txt file was not generated!");
}
elseif ($statusFile){
    exec("chown www-data:root /var/www/tmp/webaccessStatus.txt");
    
    writestatus($statusword, $statusFile);
}

?>
