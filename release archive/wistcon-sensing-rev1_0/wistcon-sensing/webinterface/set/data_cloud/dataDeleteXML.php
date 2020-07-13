<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

if($adminstatus == true){

//$xml=simplexml_load_file("/var/www/VDF.xml") or die ("Error: Cannot create object");
$xml = new DOMDocument;
$xml->load('/var/www/VDF.xml');
$Num = $_POST["dataNo"];
$Node = $_POST["Node_Name"];
$element = $xml->getElementsByTagName($Node)->item($Num);
//echo $element->nodeValue;
$element->parentNode->removeChild($element);

$xml->save('/var/www/VDF.xml');

echo json_encode(['delete_XML' => 1]);

} else {
echo json_encode(['delete_XML' => -1]);
	
}

?>
