<?php
/*
 * class Pool Cleaning interval setting
 *
 * Johannes Strasser
 * 21.08.2020
 * www.strasys.at
 *
 */

class CleaningInterval
{
	/* 
	 * This function returns true if time reached set Cleaning Interval
	 * true = within set cleaning interval
	 * false = outside set cleaning interval
	 */
	function getTimeFlag()
	{
				
		$xml = simplexml_load_file("/var/www/VDF.xml");
		
		(bool) $TimeFlag = false;
		//$RTC = new RTC();
		//get set timezone
		$Timezone = (string)($xml->timedate[0]->timezone);
		$date = new DateTime("now", new DateTimeZone($Timezone));
		$actualTime = $date->getTimestamp();
		$NumberNodes = (int) $xml->CleaningSetting[0]->CleaningInterval->count();
		for ($i=0;$i<$NumberNodes;$i++){
		    $CStart = new DateTime($xml->CleaningSetting[0]->CleaningInterval[$i]->Start, new DateTimeZone($Timezone)); 
		    $CStart = $CStart->getTimestamp();
		    $CStop = new DateTime($xml->CleaningSetting[0]->CleaningInterval[$i]->Stop, new DateTimeZone($Timezone));
		    $CStop = $CStop->getTimestamp();
			if(($actualTime >= $CStart) && ($actualTime <= $CStop)){
				$TimeFlag = true;
				break 1;
			}
		}
		return (bool) $TimeFlag;
	}
	/*
	 * This function returns a boolean value. 
	 * true = Operation Mode = AUTO
	 * false = Operation Mode = OFF
	 */
	function getopModeFlag()
	{
		$xml = simplexml_load_file("/var/www/VDF.xml");		
		(bool) $OperationFlag = false;

		$strOperationMode = (string) $xml->CleaningSetting[0]->OperationMode;
		if ($strOperationMode == 'AUTO'){
			$OperationFlag = true;
		}
		elseif ($strOperationMode == 'OFF'){
			$OperationFlag = false;
		}

		return (bool) $OperationFlag;
	}


}
?>
