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
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000_controlbox g $num $hwext", $PT1000);
		
		return (float) $PT1000[0];
	}
	
	function getPT1000round05($num, $hwext)
	{
	    unset($PT1000);
	    exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000_controlbox g $num $hwext", $PT1000);
	    /*
	     * round to 0,5 => 
	     * 0,01 - 0,24 round to 0,0
	     * 0,25 - 0,74 round to 0,5
	     * 0,75 - 0,99 round to 1,0
	     */
	    $PT1000intval = intval($PT1000[0]);
	    $PT1000diff = $PT1000[0] - $PT1000intval;
	    if ($PT1000diff < 0.25){
	        $PT1000add = 0.0;
	    }
	    if ($PT1000diff > 0.74){
	        $PT1000add = 1.0;
	    }
	    if (($PT1000diff > 0.24) && ($PT1000diff < 0.75)){
	        $PT1000add = 0.5;
	    }
	    
	    return (float) $PT1000intval + $PT1000add;
	    
	}
}
?>
