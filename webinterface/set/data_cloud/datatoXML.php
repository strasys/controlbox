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

$xml=simplexml_load_file("/var/www/VDF.xml") or die ("Error: Cannot create object");
$Node_Name = $_POST['Node_Name'];
$Data_String = $_POST['Data_String'];
$xml->$Node_Name->addChild("datatocloud", $Data_String);

$xml->asXML("/var/www/VDF.xml");

echo json_encode(['write_XML' => 1]);

} else {
echo json_encode(['write_XML' => -1]);
	
}

?>
