<?php
/*
	class composerService
	
	Johannes Strasser
	05.08.2017
	www.wistcon.at
 */

//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

class composerService
{
	//get composer Status
	//stop (0) = composer = Automatic mode is off
	//run (1)= composer = Automatic mode is on
	function getcomposerStatus()
	{
	$statusFile = fopen("/var/www/tmp/composerstatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/var/www/tmp/composerstatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		echo "test";
		$runstop = false;
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($statusFile);

	
		switch ($statusWord){
		case "stop":
			$runstop = false;
			break;
		case "run":
			$runstop = true; 
			break;
		}
	}
	return $runstop;
	}

	//set composer Status
	//status = true => set to run
	//status = false => set to stop
	function setcomposerStatus($status)
	{
	$statusFile = fopen("/var/www/tmp/composerstatus.txt", "w");
	if ($statusFile == false)
	{
		die ("Error: fopen\"/tmp/composerstatus.txt\", \"w\" ");
	}
	elseif ($statusFile)
	{
		switch ($status){
			case true:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case false:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/composer_prog/composer.php";
				exec($cmd . " > /dev/null &");
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->AutomaticHand = $statusWord;
		$xml->asXML("/var/www/VDF.xml");
	}
	}	

}
?>
