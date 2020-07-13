<?php

// Gibt an welche PHP-Fehler überhaupt angezeigt werden
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
// Da man in einem Produktivsystem üblicherweise keine Fehler ausgeben
// will sondern sie nur mitloggen will, bietet es sich an dort die
// Ausgabe der Fehler zu deaktivieren und sie stattdessen in ein Log-File
// schreiben zu lassen
/*
ini_set('display_errors', 0);
ini_set('error_log', '/pfad/zur/logdatei/php_error.log');
*/

ini_set('allow_url_fopen',1);
unset($deviceID);
$deviceID = $_POST['deviceID'];
$ip = $_SERVER['REMOTE_ADDR'];
//echo "Remote Address = ".$ip."<br>";
//echo "Post = ". $deviceID."<br>";

$artemp = array();
$i=0;
$remoteIP = file("remoteIP.txt");

foreach($remoteIP as $line)
{
	$line = trim($line);
	list($device, $deviceIP) = explode(":",$line);
	$artemp[$i] = $device;
	$artemp[$i+1] = $deviceIP;
//	echo $artemp[$i]." ".$artemp[$i+1]."<br>";
	$i=$i+2;
}

$deviceID = trim($deviceID);
$ip = trim($ip);
if (in_array($deviceID,$artemp,true))
{
	$key = array_search($deviceID, $artemp);
	$artemp[$key+1] = $ip;
	$remoteIP = fopen("remoteIP.txt","w");
	$n = count($artemp);
//	echo "n = ".$n."<br>";
	if ($remoteIP) //add error code
	{
		for ($i = 0; $i<=$n-1; $i+=2)
		{
			fwrite($remoteIP,$artemp[$i].":".$artemp[$i+1]);
				fwrite($remoteIP,"\n");
		}			
	}
	else
	{
	//log file anlegen
	fclose($remoteIP);
	break 2;
	}
fclose($remoteIP);
}
/*
 else
{
	//log file anlegen
	break 0;
}
*/
?>
