<?php
/*
	class AIN
	
	Johannes Strasser
	28.07.2017
	www.wistcon.at
*/
class AIN
{
	/*
	 * $num = AIN channel number (= 0 - 3)
	 * $hwext = position of the interface module (1 - 4)
	 * Info: If not clear run class EEPROM
	 */
	function getAIN($num, $hwext)
	{
		unset($PT1000);
		exec("flock /tmp/flockAINOUThandler /usr/lib/cgi-bin/AINOUThandler g I $num $hwext", $AIN);
		
		return (int) $AIN[0];
	}
}
?>
