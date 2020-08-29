<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

//$adminstatus = true;
//$loginstatus = true;
//$setgetComposerProcessStatus = "s";
//$setrunstopStatus = "0";
if (isset($_POST['getLoginStatus'])){
    if ($_POST['getLoginStatus'] == 'g')
    {
        $arr = array(   'loginstatus' => $loginstatus, 
                        'adminstatus' => $adminstatus);
        echo json_encode($arr);
    }
}

if(isset($_POST['setgetComposerProcessStatus'])){
    $errorMsg = "OK";
    if ($_POST['setgetComposerProcessStatus'] == 'g')
    {
        $statusFile = fopen("/var/www/tmp/composerstatus.txt", "r");
        if ($statusFile == false)
        {
            $statusFile = fopen("/var/www/tmp/composerstatus.txt", "w");
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
    }
    elseif ($_POST['setgetComposerProcessStatus'] == 's')
    {
      // unset($statusFile);
       $statusFile = fopen("/var/www/tmp/composerstatus.txt", "w");
           if ($statusFile == false)
        {
            $errorMsg = "Error: fopen\"/tmp/composerstatus.txt\", \"w\" ";
        }
        elseif ($statusFile)
        {
           switch (intval($_POST['setrunstopStatus'])){
                case 0:
                    $statusWord = "stop";
                    $runstop = 0;
                    break;
                case 1:
                    $statusWord = "run";
                    $runstop = 1;
                    $cmd = "php /var/www/composer_prog/composer.php";
                    exec($cmd  . " > /dev/null &");
                    break;

            }
            
            fwrite($statusFile,'',5);
            rewind($statusFile);
            fwrite($statusFile, $statusWord, 5);
            fclose($statusFile);
         
            $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
            $xml->OperationModeDevice[0]->AutomaticHand = $statusWord;
            $xml->asXML("/var/www/VDF.xml");
            
        }
    }
    $arr = array(   'loginstatus' => $loginstatus,
        'adminstatus' => $adminstatus,
        'runstop' => $runstop,
        'errorMsg' => $errorMsg);
    echo json_encode($arr);

}
?>
