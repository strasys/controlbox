<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/service_classes/indicator_LED_Service.inc.php');

$serviceStatus = new indicator_LED_Service; 

if (($_POST['setgetLEDserviceStatus'] == 'g') && ($adminstatus == true))
{	

	$arr = array('runstop' => $serviceStatus->getrunstop());

	echo json_encode($arr);
}

if (($_POST['setgetLEDserviceStatus'] == 's') && ($adminstatus == true))
{
	
	$serviceStatus->setrunstop($_POST['setrunstopStatus']);
}


?>
