<?php
/*
 * Write the word "run" in a text file.
 * Store it under /tmp/composerstatus.txt
 * If the file text is changed to "stop".
 * It will be read within the while loop of the composer.
 * This stops the composer.php process.
 */
class composerloopcontrol
{

function runstop()
{
$statusbool = true;
$statusFile = fopen("/tmp/composerstatus.txt","r");
if ($statusFile == false)
{
	fclose($statusFile);
	$statusFile = fopen("/tmp/composerstatus.txt", "w");
	fwrite($statusFile, "stop");
	fclose($statusFile);
	$statusbool = false;
	break;
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

return (bool) $statusbool; 
}

}
?>
