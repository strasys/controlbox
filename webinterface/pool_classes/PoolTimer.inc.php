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
		
		$NumberOutputTimer = count($xml->TimerControl->OutputTimer);
		for ($i=0;$i<$NumberOutputTimer;$i++){
		    $OutputFlag = false;
		    $OperationFlag = false;
		    $TOutput = (int) $xml->TimerControl->OutputTimer[$i]->Number[0];
		    if($xml->TimerControl->OutputTimer[$i]->operationMode[0] == 'OFF'){   
		        $OutputFlag = false;
		        $OperationFlag = false;
		    } else if ($xml->TimerControl->OutputTimer[$i]->operationMode[0] == 'AUTO'){
		        //get time periodes
		        $OperationFlag = true;
		        $NumberTimerSetting = count($xml->TimerControl->OutputTimer[$i]->TimerSetting);
		        for($j=0;$j<$NumberTimerSetting;$j++){
		            $TStart = new DateTime($xml->TimerControl->OutputTimer[$i]->TimerSetting[$j]->Start, new DateTimeZone($Timezone));
		            $TStart = $TStart->getTimestamp();
		            $TStop = new DateTime($xml->TimerControl->OutputTimer[$i]->TimerSetting[$j]->Stop, new DateTimeZone($Timezone));
		            $TStop = $TStop->getTimestamp();
		            //check special case z.B.: 23:00 bis 8:00 over midnight
		            if($TStop < $TStart){
		                if(($actualTime >= $TStart) || ($actualTime <= $TStop)){
		                    $OutputFlag = true;
		                }
		            } else if ($TStop > $TStart){
		                if(($actualTime >= $TStart) && ($actualTime <= $TStop)){
		                    $OutputFlag = true;
		                }
		            }
		        }    
	       }
	       if ($OperationFlag){
	        switch ($OutputFlag){
	               case true:
	                   $DIGIclass->setOutsingle($TOutput,1);
	                   break;
	               case false:
	                   $DIGIclass->setOutsingle($TOutput,0);
	                   break;
	           }
	       }
	   }
	   
	   
    }
}
?>
