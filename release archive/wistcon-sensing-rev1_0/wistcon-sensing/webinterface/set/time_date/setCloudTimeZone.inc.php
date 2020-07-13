<?php
/*
 * class to transfer actual timezone of divice to cloud
 * J.Strasser
 * 21.03.2018
 */

class setCloudDeviceTimeZone
{

	public function setTZtoCoud($time_zone)
	{
		$deviceIDval = trim($this->getDeviceID());
		unset ($data_string, $data);
		$data = array(
			'productID0' => $deviceIDval,
			'time_zone' => $time_zone
			);
		$data_string="";
		foreach($data as $key=>$value) 
		{
	 		$data_string = $data_string.'&'.$key.'='.$value; 
		}
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://www.strasys.at/data/dataDevicetimezone.php');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_POST, count($data));
		//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
		$return = curl_exec($ch);
		curl_close($ch);
		return $this->Databasewrite_return($return);
	}	

	private function Databasewrite_return($return){

		$returnData = explode("&", $return);
		$returnDataValues = array();
		$temp = array();
		for ($i=0;$i<2;$i++){
			$temp = explode(":", $returnData[$i]);
			$returnDataValues[$i] = $temp[1];
		}

		$returnDataFinal = array(
			'product_registerID_exist' => $returnDataValues[0],
			'database_write' => $returnDataValues[1]
		);
	
		return $returnDataFinal;	
	}

	private function getDeviceID (){
		exec("flock /tmp/flockrweeprom /usr/lib/cgi-bin/rweeprom r 2 5 192 64", $deviceID);
		$deviceIDinfo = trim($deviceID[0]);
		return $deviceIDinfo;
	}

}

?>
