<?php
/*
	class HUMIDITY
	
	Johannes Strasser
	11.03.2018
	www.strasys.at
*/
class HUMIDITY
{
	/*
	Description of function feuchte :
	feuchte [g, h, s] [F, T-C, T-F, H-E, H-D, R] [Hardware extension]
		g => get
		s => set
		h => help
		F => Feuchte in proz rel Feuchte
		T-C => Temperatur in °C
		T-F => Temperatur in °F
		H-E => Heater Enable
		H-D => Heater Disable
		R-T => read status register => Ausgabe Text
		R-I => read status register => Ausgabe als 16 bit Hex
		hw extension => integer 1 - 4
	example - get Temperatur in °C:
 		feuchte g T-C 2
	example - set Heater EIN:
		feuchte s H-E 2
	example - get read status register a Text:
		feuchte g R-T 2
	example - set (clear) status register:
		feuchte s R 2
	 * /
	
	/*
	 * $hwext = position of the interface module (1 - 4)
	 * Info: If not clear run class EEPROM
	 */
	function getHUMIDITY($hwext)
	{
		unset($HUMIDITY_val);
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte g F $hwext", $HUMIDITY_val);
		
		return (int) $HUMIDITY_val[0];
	}

	function getTemperature_C($hwext)
	{
		unset($TEMPERATURE_val);
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte g T-C $hwext", $TEMPERATURE_val);
		
		return (float) $TEMPERATURE_val[0];
	}

	function getTemperature_F($hwext)
	{
		unset($TEMPERATURE_val);
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte g T-F $hwext", $TEMPERATURE_val);
		
		return (float) $TEMPERATURE_val[0];
	}

	function setHEATER_ON($hwext)
	{
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte s H-E $hwext");
	}

	function setHEATER_OFF($hwext)
	{
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte s H-D $hwext");
	}

	function getHUMIDITY_status_register($hwext)
	{
		unset($statusregister);
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte g R-I $hwext", $statusregister);

		return (int) $statusregister[0];
	}

	function clearHUMIDITY_status_register($hwext)
	{
		exec("flock /tmp/HUMIDITYlock /usr/lib/cgi-bin/feuchte s R $hwext", $statusregister);
	}

}
?>
