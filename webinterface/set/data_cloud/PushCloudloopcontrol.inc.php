<?php
/*
 * Write the word "run" in a text file.
 * Store it under /tmp/CloudPushservicestatus.txt
 * If the file text is changed to "stop".
 * It will be read within the while loop of the composer.
 * This stops the composer.php process.
 */

class PushCloudloopcontrol
{

function runstop()
{
$statusFile = fopen("/var/www/tmp/CloudPushservicestatus.txt","r");
if ($statusFile == false)
{
	fclose($statusFile);
	$statusFile = fopen("/var/www/tmp/CloudPushservicestatus.txt", "w");
	fwrite($statusFile, "stop");
	fclose($statusFile);
	$statusbool = false;
	
}
elseif ($statusFile == true)
{
	$statusWord = trim(fgets($statusFile,5));
	fclose($statusFile);
	
	switch ($statusWord) {
		case "stop":
				$statusbool = false;
				break;
		case "run":
				$statusbool = true;
				break;
	}
}
//return true;
return $statusbool; 
}

}
?>
