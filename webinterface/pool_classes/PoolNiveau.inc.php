<?php
/*
 * class Pool Niveau control functionality
 *
 * Johannes Strasser
 * 21.08.2020
 * www.strasys.at
 *
 */

include_once "/var/www/hw_classes/GPIO.inc.php";

class Niveau
{
	/*
	 * This function returns true in case of fresh water 
	 * valve opening.
	 */
	function getNiveauFlag()
	{
		$xml = simplexml_load_file("/var/www/VDF.xml");
		if($xml == false){
		    usleep(100000);
		    $xml = simplexml_load_file("/var/www/VDF.xml");
		}
		$DIGI = new GPIO();
		//$RTC = new RTC();
		(bool) $ValveFlag = false;
		//openFlag will be set when condition start water filling is given.
		//It stays true until OvertravelTime elapses.
		//(bool) $openFlag = false;
		(int) $NiveauSensor = $DIGI->getInSingle(0);
		$OvertravelTime = (int) $xml->LevelControl[0]->Overtraveltime;
		$TimeSensorMustON = (int) $xml->LevelControl[0]->SensorONTime * 60;
		//echo "TimeSensorMustON = ".$TimeSensorMustON ."<br>";
		//$NiveauSensor = 0;
		$artemp = array();
		//echo "NiveauSensor = ".$NiveauSensor."<br>";
			$i = 0;
			$NiveauControlFile = fopen("/var/www/tmp/PoolNiveauControlFile.txt", "r");
			if ($NiveauControlFile == false){
				$NiveauControlFile = fopen("/var/www/tmp/PoolNiveauControlFile.txt","w");
				exec("chown www-data:root /var/www/tmp/PoolNiveauControlFile.txt");
				fwrite($NiveauControlFile,"timeStampaddWater:0\r\n");
				fwrite($NiveauControlFile,"timeStampNiveau:0\r\n");
				fwrite($NiveauControlFile,"sensorOnFlag:0\r\n");
				fwrite($NiveauControlFile,"openValveFlag:0\r\n");
				fclose($NiveauControlFile);
				$NiveauControlFile = fopen("/var/www/tmp/PoolNiveauControlFile.txt", "r");
			}
			if ($NiveauControlFile){
				$x=0;
				for($i=0;$i<4;$i++)
				{
					$line = fgets($NiveauControlFile,200);
					//echo $line."<br>";
					$line = trim($line);
					list($var,$varval) = explode(":",$line);
					$artemp[$x] = $var;
					$artemp[$x+1] = $varval;
					$x=$x+2;
				}
				fclose($NiveauControlFile);
			}

		//Unix time
		$date = new DateTime();
		//get UNIX - time stamp
		$actualTime = $date->getTimestamp();
		//check of openValveFlag is set to 1
		
		//Check time between first time NiveauSensor shows empty!
		if ($NiveauSensor == 0)
		{
		    //first time NiveauSensor from 1 to 0
		    if ($artemp[5] == 0){
		        $artemp[3] = $actualTime;
		        $artemp[5] = 1;
		    }
		    elseif ((($actualTime - $artemp[3]) >= $TimeSensorMustON) && ($artemp[5] == 1)){
		        $artemp[7] = 1;
		    }
		}
		elseif ($NiveauSensor == 1)
		{
		    $artemp[3] = $actualTime;
		    $artemp[5] = 0;
		}
	
		//control fresh water valve status
		if (($artemp[7] == 1) && ($artemp[5] == 1)){
            $ValveFlag = true;
		}
		elseif (($artemp[7] == 1) && ($artemp[5] == 0)){
		    $artemp[1] = $actualTime + ($OvertravelTime * 60);
		    $artemp[7] = 0;
		    $ValveFlag = true;
		}
		elseif (($artemp[7] == 0) && ($artemp[5] == 0)){
		    if(($artemp[1] - $actualTime -1) >= 0){
		        $ValveFlag = true;
		    } else {
		        $ValveFlag = false;
		    }
		}

		$NiveauControlFile = fopen("/var/www/tmp/PoolNiveauControlFile.txt", "w");
			$i = 0;
			for ($i=0;$i<8;$i=$i+2){
				fwrite($NiveauControlFile,$artemp[$i].":".$artemp[$i+1]."\r\n");	
			}	
			fclose($NiveauControlFile);	

		return (bool) $ValveFlag; 	
	}
	/*
	 * This function returns a boolean value. 
	 * true = Operation Mode = AUTO
	 * false = Operation Mode = OFF
	 */
	function getopModeFlag()
	{
		$xml = simplexml_load_file("/var/www/VDF.xml");
		if($xml == false){
		    usleep(100000);
		    $xml = simplexml_load_file("/var/www/VDF.xml");
		}
		(bool) $OperationFlag = false;

		$strOperationMode = (string) $xml->LevelControl[0]->operationMode;
		if ($strOperationMode == 'AUTO'){
			$OperationFlag = true;
		}
		elseif ($strOperationMode == 'OFF'){
			$OperationFlag = false;
			
			$NiveauControlFile = fopen("/var/www/tmp/PoolNiveauControlFile.txt", "r");
			if ($NiveauControlFile == true){
			    $NiveauControlFile = fopen("/var/www/tmp/PoolNiveauControlFile.txt","w");
			    //exec("chown www-data:root /var/www/tmp/PoolNiveauControlFile.txt");
			    fwrite($NiveauControlFile,"timeStampaddWater:0\r\n");
			    fwrite($NiveauControlFile,"timeStampNiveau:0\r\n");
			    fwrite($NiveauControlFile,"sensorOnFlag:0\r\n");
			    fwrite($NiveauControlFile,"openValveFlag:0\r\n");
			    fclose($NiveauControlFile);
			}
		}

		return (bool) $OperationFlag;
	}
}
?>
