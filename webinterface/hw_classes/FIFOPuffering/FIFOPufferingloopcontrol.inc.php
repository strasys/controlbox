<?php
/*
 * Write the word "run" in a text file.
 * Store it under /tmp/composerstatus.txt
 * If the file text is changed to "stop".
 * It will be read within the while loop of the composer.
 * This stops the composer.php process.
 */

class FIFOBufferingloopcontrol
{

function runstopFIFOPufferingTask()
{
$statusFile = fopen("/var/www/tmp/FIFOPufferTaskrunstopStatus.txt","r");
if ($statusFile == false)
{
	fclose($statusFile);
	$statusFile = fopen("/var/www/tmp/FIFOPufferTaskrunstopStatus.txt", "w");
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

return $statusbool; 
}

function runstopFIFOPufferingPT1000()
{
    $statusFile = fopen("/var/www/tmp/FIFOPufferPT1000runstopStatus.txt","r");
    if ($statusFile == false)
    {
        fclose($statusFile);
        $statusFile = fopen("/var/www/tmp/FIFOPufferPT1000runstopStatus.txt", "w");
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
    
    return $statusbool;
}
}
?>
