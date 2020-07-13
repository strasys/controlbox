<?php
/*
	class PT1000
	
	Johannes Strasser
	28.07.2017
	www.strasys.at
*/
class PT1000
{
	/*
	 * $num = PT1000 channel number (= 0 - 3)
	 * $hwext = position of the interface module (1 - 4)
	 * Info: If not clear run class EEPROM
	 */
	function getPT1000($num, $hwext)
	{
		unset($PT1000);
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g $num $hwext", $PT1000);
		
		return (float) $PT1000[0];
	}
}
?>
