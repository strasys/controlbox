<?php
/*
	class EEPROM
	
	Johannes Strasser
	19.07.2017
	www.strasys.at
*/
class EEPROM
{
	//Returns an array 
	function getExtensionAllocation()
	{
		$EEPROMdata = array();
		$startingbyte = 256;
		for ($i=0; $i<4;$i++){
			exec("flock /tmp/lockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 $startingbyte 64", $result);
			$EEPROMdata_tmp = explode(":", $result[0]);
			$EEPROMdata[] = trim($EEPROMdata_tmp[1]);
			$EEPROMdata[] = trim($EEPROMdata_tmp[2]);	
			$startingbyte += 64;
			unset($result, $EEPROMdata_tmp);
		}

		return $EEPROMdata;
	}
	//Returns device ID
	function getDeviceID()
	{
		exec("flock /tmp/lockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 192 64", $deviceID);
		return trim($deviceID[0]);
	}
	//Returns Firmenname, mainboard drawing No., Production date
	function getBasicInfo(){
		$EEPROMdata = array();
		$startingbyte = 0;
		for ($i=0; $i<3;$i++){
			exec("flock /tmp/lockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 $startingbyte 64", $result);
			$EEPROMdata[] = trim($result[0]);	
			$startingbyte += 64;
			unset($result);
		}
		return $EEPROMdata;
	}
	//Returns onboard RTC use
	function getRTCuse()
	{
		exec("flock /tmp/lockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 512 64", $RTCuse);
		return trim($RTCuse[0]);
	}

}
?>
