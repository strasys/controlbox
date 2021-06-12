<?php
/*
	class PT1000FIFO
	
	Johannes Strasser
	12.06.2021
	www.strasys.at
*/
class PT1000FIFO
{

    function getPT1000($num){
        $statusFileDir = "/var/www/tmp/PT1000FIFOPuffer.txt";
        $statusFile = fopen($statusFileDir, "r");
        for($i=0;$i<4;$i++){
            $tmpval[$i] = trim(fgets($statusFile));  
        }
        
        return floatval($tmpval[$num]);
    }
}

?>