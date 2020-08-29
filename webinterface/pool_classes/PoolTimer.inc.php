<?php
/*
 * class Timer
 *
 * Johannes Strasser
 * 21.08.2020
 * www.strasys.at
 *
 */

include_once "/var/www/hw_classes/GPIO.inc.php";

class TimerInterval
{
	/* 
	 * This function returns true if time reached set Cleaning Interval
	 * true = within set cleaning interval
	 * false = outside set cleaning interval
	 */
	function setTimerOutput()
	{	
	    $DIGIclass = new GPIO();
	    $xml = simplexml_load_file("/var/www/VDF.xml");
		//get set timezone
		$Timezone = (string)($xml->timedate[0]->timezone);
		$date = new DateTime("now", new DateTimeZone($Timezone));
		$actualTime = $date->getTimestamp();
		
		$NumberNodes = (int) $xml->TimerSetting->count();
        $arrTimerFlag = array();
		for ($i=0;$i<$NumberNodes;$i++){
		    $TStart = new DateTime($xml->TimerSetting[$i]->Start, new DateTimeZone($Timezone));
		    $TStart = $TStart->getTimestamp();
		    $TStop = new DateTime($xml->TimerSetting[$i]->Stop, new DateTimeZone($Timezone));
		    $TStop = $TStop->getTimestamp();
			$TOutput = (int) $xml->TimerSetting[$i]->Outputnumber;
			$arrTimerFlag[$i] = array('TOutput' => $TOutput,
			                         'TOutStatus' => false 			
			                         );
			
			if(($actualTime >= $TStart) && ($actualTime <= $TStop)){
			    $arrTimerFlag[$i]['TOutStatus'] = true; 
			    $DIGIclass->setOutsingle($TOutput,1);
			} else {
			    $DIGIclass->setOutsingle($TOutput,0);
			}
	   }
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

		$strOperationMode = (string) $xml->TimerControl[0]->operationMode;
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
