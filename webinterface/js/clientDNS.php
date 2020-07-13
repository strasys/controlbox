<?php
include "dnsloopcontrol.inc.php";

$dnsloop = new dnsloopcontrol();

$loopstatus = true;
//The device ID shall be stored in the final basic setup *.xml.
$deviceID = intval(00012016);
//To lock the service for the user a lock key must be set as well in the password file.
echo "diviceID = ".$deviceID."<br>";
while ($loopstatus)
{
	$loopstatus = $dnsloop->runstop();
	set_time_limit(5);
	//start request
	//sudo apt-get install php5-curl => needed
	$ch = curl_init();
	$data = array('deviceID' => $deviceID);
	curl_setopt($ch, CURLOPT_URL, 'http://dns.strasys.at/getclientIP.php');
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_exec($ch);
	curl_close($ch);
	sleep(60);
}

?>