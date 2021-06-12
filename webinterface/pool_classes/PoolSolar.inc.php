<?php
/*
 * class Pool Solar functionality 
 *
 * Johannes Strasser
 * 21.08.2020
 * www.strasys.at
 *
 */

include_once "/var/www/hw_classes/PT1000.inc.php";
include_once '/var/www/hw_classes/FIFOPuffering/PT1000FIFO.inc.php';

class Solar
{
	/* 
	 * This function returns true in case of a heating through Solar
	 * true = activate  solar
	 * false = options for solar activation not given
	 */
	function getSolarFlag()
	{			
		$xml = simplexml_load_file("/var/www/VDF.xml");
		if($xml == false){
		    usleep(100000);
		    $xml = simplexml_load_file("/var/www/VDF.xml");
		}
		$Temp = new PT1000FIFO();
		//$RTC = new RTC();
		(bool) $SolarFlag = false;
		(bool) $waitFlag = false;
		(bool) $waitFlagRoofCycling = false;
		
		$setCyclingWaterTemp = (int) $xml->SolarSetting[0]->backWaterTemp;
		$setdiffONTemp = (int) $xml->SolarSetting[0]->diffONTemp;
		$setdiffOFFTemp = (int) $xml->SolarSetting[0]->diffOFFTemp;
		$setSwitchOFFdelay = (int) $xml->SolarSetting[0]->SwitchOFFdelay;	
		$setSwitchONdelay = (int) $xml->SolarSetting[0]->SwitchONdelay;		
		$PoolTemp = $Temp->getPT1000(0);
		$RoofTemp = $Temp->getPT1000(3);
		$CyclingTemp = $Temp->getPT1000(2);
	/*	
		$RoofTemp = 18.0;
		$CyclingTemp = 20.0;
		echo("PoolTemp = ".$PoolTemp."<br>");
		echo("RoofTemp = ".$RoofTemp."<br>");
		echo("CyclingTemp = ".$CyclingTemp."<br>");
		$Test = $RoofTemp - $CyclingTemp;
		echo("RoofTemp - CyclingTemp = ".$Test."<br>");
	*/
		//$actualTime = strtoTime($RTC->getstrTimeHHMM()); 
		$date = new DateTime();
		//get UNIX - time stamp
		$actualTime = $date->getTimestamp();
		// In a text file waiting times are stored.
		// waitmintime = UnixTime + x minutes => This is the minimum time the heating cycle is off after switch off.
		// runmintime = UnixTime + x minutes => This is the minimum time the heating cycle is on after switch on.
		// StatusSolar = shows the last status of the system => 0 = off, 1 = on
		//echo("actualTime = ".$actualTime."<br>");
		$artemp = array();
		$i = 0;
		$TempControlFile = fopen("/var/www/tmp/PoolTempControlFile.txt", "r");
		if ($TempControlFile == false){
			$TempControlFile = fopen("/var/www/tmp/PoolTempControlFile.txt","w");
			exec("chown www-data:root /var/www/tmp/PoolTempControlFile.txt");
			fwrite($TempControlFile,"SwitchONdelay:0\r\n");
			fwrite($TempControlFile,"SwitchOFFdelay:0\r\n");
			fwrite($TempControlFile,"SolarON:0\r\n");
			fclose($TempControlFile);
			$TempControlFile = fopen("/var/www/tmp/PoolTempControlFile.txt", "r");
		}
		if ($TempControlFile){
			$x=0;
			for($i=0;$i<3;$i++)
			{
				$line = fgets($TempControlFile,200);
				//echo $line."<br>";
				$line = trim($line);
				list($var,$varval) = explode(":",$line);
				$artemp[$x] = $var;
				$artemp[$x+1] = $varval;
				$x=$x+2;
			}
			fclose($TempControlFile);
		}
		
    /*  echo ("artemp[1] = ".$artemp[1]."<br>");
        echo ("artemp[3] = ".$artemp[3]."<br>");
        echo ("artemp[5] = ".$artemp[5]."<br>");
    */
		// Check if one of the waiting functions is activ!
		
		if (($artemp[1] > $actualTime) || ($artemp[3] > $actualTime)){
			$waitFlag = true;
		}

		if ((($RoofTemp - $CyclingTemp) >= $setdiffONTemp)&&($artemp[5] == 0)&&($waitFlag == false)&&($CyclingTemp <= $setCyclingWaterTemp))
		{
			$SolarFlag = true;
			$artemp[5] = 1;
			$artemp[3] = $actualTime + ($setSwitchOFFdelay * 60);
		}
		else if (($artemp[5] == 1)&&($waitFlag == false)&&($CyclingTemp > $setCyclingWaterTemp))
		{
			$artemp[1] = $actualTime + ($setSwitchONdelay * 60);
			$artemp[5] = 0;
			$SolarFlag = false;
		}
		else if ((($RoofTemp - $CyclingTemp) <= $setdiffOFFTemp)&&($artemp[5] == 1)&&($waitFlag == false))
		{
			$artemp[1] = $actualTime + ($setSwitchONdelay * 60);
			$artemp[5] = 0;
			$SolarFlag = false;
		}
		else if ((($RoofTemp - $CyclingTemp) >= $setdiffOFFTemp)&&($artemp[5] == 1)&&($waitFlag == false))
		{
			$SolarFlag = true;
		}

		else if (($artemp[5] == 0)&&($waitFlag == true)){
			$SolarFlag = false;
		}
		else if (($artemp[5] == 1)&&($waitFlag == true)){
			$SolarFlag = true;
		}
		
		$TempControlFile = fopen("/var/www/tmp/PoolTempControlFile.txt", "w");
		$i = 0;
		for ($i=0;$i<6;$i=$i+2){
			fwrite($TempControlFile,$artemp[$i].":".$artemp[$i+1]."\r\n");	
		}	
		 fclose($TempControlFile);	
		
		return (bool) $SolarFlag;
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

		$strOperationMode = (string) $xml->SolarSetting[0]->operationMode;
		if ($strOperationMode == 'AUTO'){
			$OperationFlag = true;
		}
		elseif ($strOperationMode == 'OFF'){
			$OperationFlag = false;

			//Delete all Time - Marker
			$TempControlFile = fopen("/var/www/tmp/PoolTempControlFile.txt", "w");
			if ($TempControlFile == true){
				fwrite($TempControlFile,"SwitchONdelay:0\r\n");
				fwrite($TempControlFile,"SwitchOFFdelay:0\r\n");
				fwrite($TempControlFile,"SolarON:0\r\n");
				fclose($TempControlFile);
			}
		}

		return (bool) $OperationFlag;
	}
}
?>
