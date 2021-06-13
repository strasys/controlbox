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
	    if($xml == false){
	        usleep(100000);
	        $xml = simplexml_load_file("/var/www/VDF.xml");
	    }
		//get set timezone
		$Timezone = (string)($xml->timedate[0]->timezone);
		$date = new DateTime("now", new DateTimeZone($Timezone));
		$actualTime = $date->getTimestamp();
		
		$NumberOutputTimer = count($xml->TimerControl->OutputTimer);
		$FileDir = "/var/www/tmp/PoolTimer.txt";
		if(!file_exists($FileDir)){
		    $filehandle = fopen($FileDir,"w");
		    for($i=0;$i<$NumberOutputTimer;$i++){
		        $TOutput = (int) $xml->TimerControl->OutputTimer[$i]->Number[0];
		        fwrite($filehandle,"DIGIOutput:".$TOutput.":1\n\r");
		        $TOutputMonitor[$TOutput] = 1;
		    }
		    fclose($filehandle);
		} else {
		    $filehandle = fopen($FileDir,"r");
		    for($i=0;$i<$NumberOutputTimer;$i++){
		      $TOutput = (int) $xml->TimerControl->OutputTimer[$i]->Number[0];
		      $tmpOutputMonitor = explode(":",trim(fgets($filehandle)));
		      $TOutputMonitor[$TOutput] = $tmpOutputMonitor[2];
		    }
		    fclose($filehandle);
		}
		
		for ($i=0;$i<$NumberOutputTimer;$i++){
		    $OutputFlag = false;
		    $OperationFlag = false;
		    $TOutput = (int) $xml->TimerControl->OutputTimer[$i]->Number[0];
		    if($xml->TimerControl->OutputTimer[$i]->operationMode[0] == 'OFF' && $TOutputMonitor[$TOutput] == 1){   
		        $OutputFlag = false;
		        $OperationFlag = false;
		        if($TOutputMonitor[$TOutput] == 1){
		          $TOutputMonitor[$TOutput] = 0;
		          $DIGIclass->setOutsingle($TOutput,0);
		        }
		    } elseif ($xml->TimerControl->OutputTimer[$i]->operationMode[0] == 'AUTO'){
		        //get time periodes
		        $OperationFlag = true; 
		        $TOutputMonitor[$TOutput] = 1;
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
		            } elseif ($TStop > $TStart){
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
	   $filehandle = fopen($FileDir,"r+");
	   for($i=0;$i<$NumberOutputTimer;$i++){    
	       $TOutput = (int) $xml->TimerControl->OutputTimer[$i]->Number[0];
	       fwrite($filehandle,"DIGIOutput:".$TOutput.":".$TOutputMonitor[$TOutput]."\n\r");
	   }
	   fclose($filehandle);
	   
    }
}
?>
