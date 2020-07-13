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
}
?>
