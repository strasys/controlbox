<?php
/*
 * class Pool Niveau control functionality
 *
 * Johannes Strasser
 * 14.09.2016
 * www.strasys.at
 *
 */

include_once "/var/www/hw_classes/RTC.inc.php";
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
		$DIGI = new GPIO();
		$RTC = new RTC();
		(bool) $NiveauFlag = false;
		//openFlag will be set when condition start water filling is given.
		//It stays true until OvertravelTime elapses.
		(bool) $openFlag = false;
		(int) $NiveauSensor = $DIGI->getInSingle(0);
		$OvertravelTime = (int) $xml->LevelControl[0]->Overtraveltime;
		$TimeSensorMustON = (int) $xml->LevelControl[0]->SensorONTime * 60;
	//	echo $TimeSensorMustON ."= TimeSensorMustON<br>";
	//	$NiveauSensor = 1;
		$artemp = array();
			$i = 0;
			$NiveauControlFile = fopen("/tmp/PoolNiveauControlFile.txt", "r");
			if ($NiveauControlFile == false){
				$NiveauControlFile = fopen("/tmp/PoolNiveauControlFile.txt","w");
				exec("chown www-data:root /tmp/PoolNiveauControlFile.txt");
				fwrite($NiveauControlFile,"timeStampaddWater:0\r\n");
				fwrite($NiveauControlFile,"timeStampNiveau:0\r\n");
				fwrite($NiveauControlFile,"sensorOnFlag:0\r\n");
				fwrite($NiveauControlFile,"openValveFlag:0\r\n");
				fclose($NiveauControlFile);
				$NiveauControlFile = fopen("/tmp/PoolNiveauControlFile.txt", "r");
			}
			if ($NiveauControlFile){
				$x=0;
				for($i=0;$i<4;$i++)
				{
					$line = fgets($NiveauControlFile,200);
				//	echo $line;
					$line = trim($line);
					list($var,$varval) = explode(":",$line);
					$artemp[$x] = $var;
					$artemp[$x+1] = $varval;
					$x=$x+2;
				}
				fclose($NiveauControlFile);
			}

		//Unix time
		$actualTime = strtoTime($RTC->getstrTimeHHMM());
		//check of openValveFlag is set to 1
		if ($artemp[7] == 1)
		{
			//compare time stamp add water
			if (($artemp[1] - $actualTime -1) >= 0){
				$openFlag = true;
			}
			else
			{
				$openFlag = false;
				$artemp[7] = 0;	
			}
		}

		if (($NiveauSensor == 0)&&($openFlag == false))
		{
			if ($artemp[5] == 0){
				$artemp[3] = $actualTime;
				$artemp[5] = 1;
			}
	//TODO: Absicherung durch SensorONFalg = 1
			if ((($actualTime - $artemp[3]) >= $TimeSensorMustON) && $artemp[5]){
				$NiveauFlag = true;
				$artemp[1] = $actualTime + ($OvertravelTime * 60);
				$artemp[5] = 0;
				$artemp[7] = 1;
			}		
		}
		else if (($NiveauSensor == 1)&&($openFlag == false))
		{
			$artemp[3] = $actualTime;
			$artemp[5] = 0;
			$NiveauFlag = false;
		}
		else if (($NiveauSensor == 1)&&($openFlag == true))
		{
			$NiveauFlag = true;
			$artemp[3] = $actualTime;
		}
		else if (($NiveauSensor == 0)&&($openFlag == true))
		{
			$NiveauFlag = true;
			$artemp[3] = $actualTime;
		}
	

		$NiveauControlFile = fopen("/tmp/PoolNiveauControlFile.txt", "w");
			$i = 0;
			for ($i=0;$i<8;$i=$i+2){
				fwrite($NiveauControlFile,$artemp[$i].":".$artemp[$i+1]."\r\n");	
			}	
			fclose($NiveauControlFile);	

		return (bool) $NiveauFlag; 	
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

		$strOperationMode = (string) $xml->LevelControl[0]->operationMode;
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
