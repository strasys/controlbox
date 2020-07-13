<?php
/*
 * class Pool Cleaning interval setting
 *
 * Johannes Strasser
 * 27.08.2016
 * www.strasys.at
 *
 */

include_once "/var/www/hw_classes/RTC.inc.php";


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
		
		$RTC = new RTC();
		(bool) $TimeFlag = false;
		$actualTime = (int) strtoTime($RTC->getstrTimeHHMM());
		$NumberNodes = (int) $xml->CleaningInterval->count();

		for ($i=0;$i<$NumberNodes;$i++){
			$CStart = (int) strtoTime($xml->CleaningInterval[$i]->Start);
			$CStop = (int) strtoTime($xml->CleaningInterval[$i]->Stop);
			
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
