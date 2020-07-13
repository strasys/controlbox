<?php
/*
	class EEPROM
	
	Johannes Strasser
	19.07.2017
	www.wistcon.at
*/
class pushButtonSensingService
{
	//get Inputs set for push button sensing and status
	//1 = set for sensing
	//0 = not set for sensing
	function getInputSetforSensing()
	{
	$statusFile = fopen("/usr/lib/cgi-bin/pushButtonSensingDigiInStatus.txt","r");
	if ($statusFile == false)
	{
		$errorMsg = "Could not read \"pushButtonSensingDigiInStatus.txt\"! 
		Start sensing first time to generate the file!";
	}
	elseif ($statusFile)
	{
		$sensingStatus = array();
		for ($i=0;$i<12;$i++){
			$line = fgets($statusFile, 30);
			$DigiInStatus = explode(":",$line);
			$DigiIN[$i] = trim($DigiInStatus[2]);

			switch($DigiIN[$i]){
			case 'N':
				$sensingStatus[$i] = '0';
				break;
			case '0':
				$sensingStatus[$i] = '1';
				break;
			case '1':
				$sensingStatus[$i] = '1';
				break;
			}
		}		
	}
	return $sensingStatus;
	}

	//IN:x:[N/0/1]
	//IN = Descriptor
	//x = Number of IN - Channel
	//[N/0/1] = N - Not set for Sensing, 0 = status (ON), 1 = status (OFF)
	function getInputToggleStatus()
	{
		$statusFile = fopen("/usr/lib/cgi-bin/pushButtonSensingDigiInStatus.txt","r");
		if ($statusFile == false)
		{
			$errorMsg = "Could not read \"pushButtonSensingDigiInStatus.txt\"! 
			Start sensing first time to generate the file!";
		}
		elseif ($statusFile)
		{
			for ($i=0;$i<12;$i++){
				$line = fgets($statusFile, 30);
				$DigiInStatus = explode(":",$line);
				$DigiIN[$i] = trim($DigiInStatus[2]);
			}
		}
		return $DigiIN;
	}

	//$sensing must be an array of style (0,1,...) 12 entries 
	//$toggling = time in ms (standard if not set = 80ms)
	function setInputforSensing($sensing, $toggling)
	{
		$cmd = " /usr/lib/cgi-bin/pushButtonSensing $sensing[0] $sensing[1] $sensing[2] $sensing[3] $sensing[4] $sensing[5] $sensing[6] $sensing[7] $sensing[8] $sensing[9] $sensing[10] $sensing[11] $toggling"; 
		exec($cmd . " > /dev/null &");

	}


}
?>
