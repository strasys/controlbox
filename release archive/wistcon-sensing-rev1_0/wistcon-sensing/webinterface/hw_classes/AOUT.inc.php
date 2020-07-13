<?php
/*
	class AOUT
	
	Johannes Strasser
	28.07.2017
	www.wistcon.at
*/
class AOUT
{
	/*
	 * $num = AOUT channel number (= 1 - 4)
	 * $hwext = position of the interface module (1 - 4)
	 * Info: If not clear run class EEPROM
	 */
	function getAOUT($num, $hwext)
	{
		unset($AOUT);
		exec("flock /tmp/flockAINOUThandler /usr/lib/cgi-bin/AINOUThandler g O $num $hwext", $AIN);
		
		return (int) $AOUT[0];
	}
	
	/*
	 * $num = AOUT channel number (= 1 - 4)
	 * $val = AOUT digit value for 10 bit sensor = 0 - 1023
	 * $hwext = position of the interface module (1 - 4)
	 * Info: If not clear run class EEPROM
	 */
	function setAOUT($num, $val, $hwext)
	{
		exec("flock /tmp/flockAINOUThandler /usr/lib/cgi-bin/AINOUThandler s O $num $val $hwext");
		
	}


}
?>
