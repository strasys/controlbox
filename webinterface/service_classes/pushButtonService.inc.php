<?php
/*
	class pushButtonSensingService
	
	Johannes Strasser
	27.03.2021
	www.wistcon.at
*/

class pushButtonSensingService
{
    //set GPIOIN for Push Button Sensing
    function SetSensing($GPIOnum, $Status){
        $statusFileDir = "/var/www/tmp/pushButtonSensingDigiInStatus.txt";
        if (!file_exists($statusFileDir))
        {
            $statusFile = fopen($statusFileDir, "w");
           // exec("chown www-data:root /var/www/tmp/pushButtonSensingDigiInStatus.txt");
           // exec("chmod g+w /var/www/tmp/pushButtonSensingDigiInStatus.txt");
            $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
            $numGPIOIN = $xml->GPIOIN->count();
           
            for($i=0;$i<$numGPIOIN;$i++){
                fwrite($statusFile, "IN:".$i.":N".PHP_EOL);
            }
            
            fclose($statusFile);
        }
        
        $statusFile = fopen($statusFileDir, "r+");

        $File_arr = array();
        $File_arr = array_map('trim', file($statusFileDir, FILE_IGNORE_NEW_LINES));
        
        $File_arr[$GPIOnum] = "IN:".$GPIOnum.":".$Status;
        $FilearrSize = count($File_arr);
       
        for($i=0;$i<$FilearrSize;$i++){
            fwrite($statusFile, $File_arr[$i].PHP_EOL);
        }
 /*   
        rewind($statusFile);
        while(!feof($statusFile)){
            echo fgets($statusFile)."<br>";
        }
 */     
        fclose($statusFile);

    }	
    
    function GetSensing(){
        
        $statusFileDir = "/var/www/tmp/pushButtonSensingDigiInStatus.txt";
        if (!file_exists($statusFileDir))
        {
            $statusFile = fopen($statusFileDir, "w");
            //exec("chown www-data:root /var/www/tmp/pushButtonSensingDigiInStatus.txt");
            $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
            $numGPIOIN = $xml->GPIOIN->count();
            
            for($i=0;$i<$numGPIOIN;$i++){
                fwrite($statusFile, "IN:".$i.":N".PHP_EOL);
            }
            
            fclose($statusFile);
        }
        
        $statusFile = fopen($statusFileDir, "r");
        
        $File_arr = array();
        $File_arr = array_map('trim', file($statusFileDir, FILE_IGNORE_NEW_LINES));
        
            $onlyStatusFile_arr = array();
        foreach ($File_arr as $value){
            $temp_arr = explode(":",$value);
            $onlyStatusFile_arr[] = $temp_arr[2];
        }
        
        fclose($statusFile);
        
        return $onlyStatusFile_arr;
    }
    
    function getrunstopStatus(){
        $statusFileDir = "/var/www/tmp/pushButtonSensingRunStop.txt";
        if (!file_exists($statusFileDir))
        {
            $statusFile = fopen($statusFileDir, "w");
            fwrite($statusFile, "stop");
            fclose($statusFile);
            $xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
            $xml->OperationModeDevice[0]->pushButtonSensing = $statusWord;
            $xml->asXML("/var/www/VDF.xml");
        }
        
            $statusFile = fopen($statusFileDir, "r");
            $statusWord = trim(fgets($statusFile, 5));
            fclose($statusFile);
        
        if($statusWord == 'run'){
            $boolStatus = true;
        } else if ($statusWord == 'stop'){
            $boolStatus = false;
        }
        
        return $boolStatus;         
    }
    
	//get Inputs set for push button sensing and status
	//1 = set for sensing
	//0 = not set for sensing
	function getInputSetforSensing()
	{
	$statusFile = fopen("/var/www/tmp/pushButtonSensingDigiInStatus.txt","r");
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
		$statusFile = fopen("/var/www/tmp/pushButtonSensingDigiInStatus.txt","r");
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
