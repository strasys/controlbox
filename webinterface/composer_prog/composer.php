<?php 
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once "/var/www/hw_classes/GPIO.inc.php";
include_once "/var/www/hw_classes/PT1000.inc.php";
include_once "/var/www/hw_classes/RTC.inc.php";
include_once "/var/www/service_classes/composerService.inc.php";
include_once "/var/www/pool_classes/PoolCleaninterval.inc.php";
include_once "/var/www/pool_classes/PoolSolar.inc.php";
include_once "/var/www/pool_classes/PoolNiveau.inc.php";

$DIGI = new GPIO();
$loopstatuscontrol = new composerService();
$Cleaning = new CleaningInterval();
$Solar = new Solar();
$Niveau = new Niveau();

date_default_timezone_set('CET');


/*
 * To initially start the process of the 
 * composer loop $loopstatus must be set to true.
 */  
$loopstatus = true;

/*
 * Define basic settings.
 */

$OUT = array (	0 => 0,
		1 => 0,
		2 => 0,
		3 => 0,
		4 => 0,
		5 => 0,
		6 => 0,
		7 => 0
);

//$DIGI->setOut($OUT);

/*
 * Set RUN LED to true
 */
$DIGI->setOutsingle(12,1);

while ($loopstatus){
	/*
	 * Loop control function.
	 * Attention: Without the implementation of the 
	 * composerloopcontrol class the loop can not be operated
	 * in a defined and controlled mode.
	 * => run = true/ stop = false
	 */
	$loopstatus = $loopstatuscontrol->getcomposerStatus();

//	$loopstatus = true;
	//TODO: Add log file function.
	/*
	 * Without setting a time limit the loop will stop after a while.
	 *Further this function should secure the run of the system.
	 */
	set_time_limit(5); //Set to 5 seconds.

	/*
	 * Decission loop of pump on or off based on functions.
	 */
	(bool) $PumpFlag = false;
	
	/*
	 * Following block controls the Cleaning intervals
	 */
	
	if ($Cleaning->getopModeFlag() && $Cleaning->getTimeFlag())
	{
		$PumpFlag = true;
	}

	/*
	 * Following block controls the Solar functionality.
	 */
	(bool) $SolarMixerFlag = false;

	if ($Solar->getopModeFlag() && $Solar->getSolarFlag())
	{
		$PumpFlag = true;
		$SolarMixerFlag = true;	
	}

	/*
	 * Solar Mixer Status control
	 */

	//TODO: Add solar Mixer movement evaluation and display error if Solar mixer does not reach the position.
	
	(bool) $MixerOFF = false;
	if ($DIGI->getOutSingle(0) == 0)
	{
		(bool) $MixerOFF = true;
	}

	if ($SolarMixerFlag && $MixerOFF)
	{
		$DIGI->setOutsingle(0,1);
	}
	elseif ($SolarMixerFlag == false)
	{
		$DIGI->setOutsingle(0,0);	
	}

	/*
	 * Watter level control function
	 */
	(bool) $WatterValveON = false;
	if ($Niveau->getNiveauFlag() && $Niveau->getopModeFlag())
	{
		$WatterValveON = true;
	}

	if (($DIGI->getOutSingle(4) == 0)&&($WatterValveON == true))
	{
		$DIGI->setOutsingle(4,1);	
	}
	else if (($DIGI->getOutSingle(4) == 1)&&($WatterValveON == false))
	{
		$DIGI->setOutsingle(4,0);
	}
	

	/*
	 * Pump on off based on above function decissions 
	 */

	(bool) $PumpOFF = false;
	if ($DIGI->getOutSingle(1) == 0)
	{
		(bool) $PumpOFF = true;
	}

	if ($PumpFlag && $PumpOFF)
	{
		$DIGI->setOutsingle(1,1);			
	}
	elseif ($PumpFlag == false)
	{
		$DIGI->setOutsingle(1,0);
	}
	
	usleep(150000); //Time set in µs!
	
	/*
	 * Define privatePLC status if $status = false.
	 * Clarify what the DigiOut and Analogue Out settings should be
	 * in case of a stop of the script.
	 */
	
	if ($loopstatus == false)
	{
		$OUT = array (	0 => 0,
				1 => 0,
				2 => 0,
				3 => 0,
				4 => 0,
				5 => 0,
				6 => 0,
				7 => 0
		);
	//	$DIGI->setOut($OUT);

		$DIGI->setOutsingle(12,0);
	}

}
?>
