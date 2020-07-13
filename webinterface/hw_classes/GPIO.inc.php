<?php
/*
	class GPIO
	
	Johannes Strasser
	28.07.2017
	www.wistcon.at
*/
class GPIO
{

	/*
	 * set the digital output 
	 *$out[$i] is an array  => (0 = off, 1 = on)
	 *$i is the (=number of digital output) 0 to 11 => OUT1 ... OUT12
	 */
	function setOut($out)
	{
		for ($i = 0; $i<11; $i++)
		{
			
			exec("flock /tmp/GPIOlock /usr/lib/cgi-bin/GPIOhandler_020 s $i $out[$i]");
		}
	}
	/*
	 *For fast switching operations (flash light, etc.) it is recommended to use
	 *the setOutsingle function instead of the setOut function.
	 *$i (0 to 11) is the number of the digital output.
	 *$outs is 0 or 1 (0 = off, 1 = on) is the to be set value of the Output.
	 */
	function setOutsingle($i, $outs)
	{
		
		exec("flock /tmp/GPIOslock /usr/lib/cgi-bin/GPIOhandler_020 s $i $outs");
	}
	/*
	 * The function getOut returns an array numbered 0..11 (=OUT 1 to OUT 12)
	 */
	function getOut()
	{
		unset($ausgabeOut);
		exec("flock /tmp/GPIOslock /usr/lib/cgi-bin/GPIOhandler_020 g O", $ausgabeOut);
		
		return $ausgabeOut;
	}

	function getOutSingle($channel){
		exec("flock /tmp/GPIOslock /usr/lib/cgi-bin/GPIOhandler_020 g O", $ausgabeOut);
		$OutSingle = $ausgabeOut[$channel];
		return (int) $OutSingle;
	}
	/*
	 * The function getIn returns an array numbered 0..11 (=IN 1 to 12)
	 */
	function getIn()
	{
		unset($ausgabeIn);
		exec("flock /tmp/GPIOslock /usr/lib/cgi-bin/GPIOhandler_020 g I", $ausgabeIn);
		
		return $ausgabeIn;
	}

	function getInSingle($num){
		unset($ausgabeIn);
		exec("flock /tmp/GPIOslock /usr/lib/cgi-bin/GPIOhandler_020 g I", $ausgabeIn);
		
		return (int) $ausgabeIn[$num];
	}
}
?>
