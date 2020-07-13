<?php 
include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
unset($getLoginStatus, $setgetComposerStatus, $runstop, $setrunstopStatus);
$getLoginStatus = $_POST['getLoginStatus'];
$setgetpushButtonSensingProcessStatus = $_POST['setgetpushButtonSensingProcessStatus'];
$setrunstopStatus = $_POST['setrunstopStatus'];
$sensingChannels = $_POST['sensingChannels']; // as an array Attention: Array includes comma values (0,1,1,1) Therefor 0 = 0 but 1 would be ,
$sensingCycle = $_POST['sensingCycle'];

unset($arr);
$get = "g";
$set = "s";

if ($getLoginStatus == $get)
{
	transfer_javascript($loginstatus, $adminstatus);
}

if ($setgetpushButtonSensingProcessStatus == $get)
{
	$statusFile = fopen("/tmp/pushButtonSensingRunStop.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/tmp/pushButtonSensingRunStop.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		$statusWord = "stop";
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($status);
	}
	
	switch ($statusWord){
		case "stop":
			$runstop = 0;
			break;
		case "run":
			$runstop = 1;
			break;
	}
/*
 * The following part of the get attribute was set to get the set status 
 * of the push button sensing inputs.
*/
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
	
	transfer_javascript($loginstatus, $adminstatus, $runstop, $errorMsg, $DigiIN);
}

if ($setgetpushButtonSensingProcessStatus == $set)
{
	$statusFile = fopen("/tmp/pushButtonSensingRunStop.txt", "w");
	if ($statusFile == false)
	{
		$errorMsg = "Error: file could not be opened! ";
	}
	elseif ($statusFile == true)
	{
		
		switch ($setrunstopStatus)
		{
			case 0:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case 1:
				$statusWord = "run";
				$runstop = 1;
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);
	
		if ($statusWord == "run")
		{
			$sensing = explode(",",$sensingChannels,12);
			$cmd = " /usr/lib/cgi-bin/pushButtonSensing $sensing[0] $sensing[1] $sensing[2] $sensing[3] $sensing[4] $sensing[5] $sensing[6] $sensing[7] $sensing[8] $sensing[9] $sensing[10] $sensing[11]"; 
			exec($cmd . " > /dev/null &");
		}
	}
	transfer_javascript($loginstatus, $adminstatus, $runstop, $errorMsg);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->pushButtonSensing = $statusWord;
		$xml->asXML("/var/www/VDF.xml");
 
}

function transfer_javascript($loginstatus, $adminstatus, $runstop, $errorMsg, $DigiIN)
{
	$arr = array(	'loginstatus' => $loginstatus ,
					'adminstatus' => $adminstatus ,
					'runstop' => $runstop,
					'errorMsg' => $errorMsg
	);
/* 
 * The transfered data's are:
 * N = Not selectet for Sensing
 * 1 = Signal on Input low.
 * 0 = Signal on Input high.
*/ 
	for ($i=0;$i<12;$i++)
	{
	$arr["IN$i"] = $DigiIN[$i];
	}
	echo json_encode($arr);
}

?>
