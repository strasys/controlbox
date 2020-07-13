<?php
// Gibt an welche PHP-Fehler �berhaupt angezeigt werden
//error_reporting(E_ALL | E_STRICT);
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
include_once ('dnsloopcontrol.inc.php');

$dnsloop = new dnsloopcontrol();

$loopstatus = true;
//The device ID shall be stored in the final basic setup *.xml.

exec("flock /tmp/flockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 192 64", $deviceID);
$deviceIDinfo = trim($deviceID[0]);


$loopstatus;	
//To lock the service for the user a lock key must be set as well in the password file.
//echo http_build_query($data) . "\n";
while ($loopstatus)
{
	$loopstatus = $dnsloop->runstop();
	set_time_limit(5);
	
	exec("hostname -I", $local_IP);
	$IP = explode(" ", $local_IP[0]);
	
	$data = array(
	    'deviceID' => $deviceIDinfo,
	    'local_IP' => $IP[0]
	);
	
	$data_string="";
	foreach($data as $key => $value)
	{
	    $data_string = $data_string.$key.'='.$value.'&';
	}
	
	//sudo apt-get install php5-curl => needed
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://www.strasys.at/dns/getclientIP.php');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_POST, count($data));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
	$return = curl_exec($ch);
	curl_close($ch);
	
	unset($data_string);
//	echo $return;
	/*
	//start request

	$ch = curl_init();
	//$data = array('deviceID' => $deviceID);
	curl_setopt($ch, CURLOPT_URL, 'http://dns.strasys.at/getclientIP.php');
	curl_setopt($ch, CURLOPT_POST, 1);
			CURLOPT_SSL_VERIFYPEER
	curl_exec($ch);
	curl_close($ch);
 */
	sleep(60);
}

?>
