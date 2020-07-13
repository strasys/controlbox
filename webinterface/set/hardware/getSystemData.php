<?php
error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/hw_classes/EEPROM.inc.php');

// Ausstieg bei falschem Passwort!
if($loginstatus == false)
{ 
	die ("Error: kein gültiges Passwort!");
}

$EEPROM_Data = new EEPROM;
// Read Manufacturer Name, mainboard drawing No., Production Date
// Array 0 - 2
$BasicInfo = $EEPROM_Data->getBasicInfo();
//Extension 1 - 4
//output array 0 - 3
$SensorHardware = $EEPROM_Data->getExtensionAllocation();
//device ID
$deviceID = $EEPROM_Data->getDeviceID();
//RTC in use?
$RTC = $EEPROM_Data->getRTCuse();

exec('uname -r', $Kernelvers);
exec('cat /etc/debian_version', $Debianvers);
//system('/usr/lib/cgi-bin/getOSData.sh', $OSdata);
$IPaddress_user = $_SERVER['REMOTE_ADDR'];
$IPaddress_server = $_SERVER['SERVER_ADDR'];

$arr = array( 	'manu' => $BasicInfo[0],
	'mainboard_drawing' => $BasicInfo[1],
	'production_date' => $BasicInfo[2],
	'ext1addr' => $SensorHardware[0],
	'ext1name' => $SensorHardware[1],
	'ext2addr' => $SensorHardware[2],
	'ext2name' => $SensorHardware[3],
	'ext3addr' => $SensorHardware[4],
	'ext3name' => $SensorHardware[5],
	'ext4addr' => $SensorHardware[6],
	'ext4name' => $SensorHardware[7],
	'deviceID' => $deviceID,
	'RTCuse' => $RTC,
	'Kernel' => $Kernelvers[0],
	'Debian' => $Debianvers[0],
	'IPaddressServer' => $IPaddress_server,
	'IPaddressUser' => $IPaddress_user
	);

echo json_encode($arr);

?>
