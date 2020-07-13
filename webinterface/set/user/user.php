<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

$username = $_POST["username"];
$password = $_POST["password"];
$password2 = $_POST["passwordRepeat"];
$adminright = $_POST["adminright"];
unset($arr);
unset($errorFile, $errorUsername, $errorPasswordRepeat);
$errorFile = 0; //If errorFile variable = -1 than fopen is False
$errorUsername = 0; //If username exists already value = -1
$errorPasswordRepeat = 0; //If password and password2 are not equal value = -1


if ($_POST["loginstatus"] == 'get'){
	$arr = array('loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
	);

	echo json_encode($arr);
}

if (($_POST["setget"] == 'get') && ($adminstatus == true)){
	$user_array = array();
	$userfile = fopen("/var/secure/user.txt","r");
	if ($userfile == FALSE)
	{
		$errorFile = -1;
	}
	else
	{
	while (!feof($userfile))
		{
		$line = fgets($userfile,500);
		$userdata = explode("|", $line);
		array_push ($user_array, trim($userdata[0]), trim($userdata[2]));
		}
	fclose($userfile);
	
	$n = count($user_array);

	$transfer_array = array();
	array_push($transfer_array, $n);
	for ($i=0;$i<$n;$i++){
		array_push($transfer_array, $user_array[$i]);
	}

	echo json_encode($transfer_array);
	}
}

if (($_POST["setget"] == 'set')&&($adminstatus == true)){ 
	$user_existing = array();
	//TODO: upgrade to PHP 5.5.x necessary to use $passwordEncrypt = password_hash($password, PASSWORD_DEFAULT); 
	$passwordEncrypt = md5($password);

	$userfile = fopen("/var/secure/user.txt","r");
	if ($userfile == FALSE)
	{
	$errorFile = -1;
	}
	else
	{
	while (!feof($userfile))
		{
		$line = fgets($userfile,500);
		$userdata = explode("|", $line);
		array_push ($user_existing,$userdata[0]);
		}
	fclose($userfile);

	if (in_array($username, $user_existing))
	{
		$errorUsername = -1;
	}
	else
	{
		$userfile = fopen ("/var/secure/user.txt","a");
		fwrite($userfile, $username);
		fwrite($userfile, "|");
		fwrite($userfile, $passwordEncrypt);
		fwrite($userfile, "|");
		fwrite($userfile, $adminright);
		fwrite($userfile, "\n");
		fclose($userfile);
	}
	}
	$arr = array( 	
		'errorFile' => $errorFile,
		'errorUsername' => $errorUsername,
		'loginstatus' => $loginstatus,
		'adminstatus' => $adminstatus
	);

		echo json_encode($arr);
}

if (($_POST["setget"] == 'change')&&($adminstatus == true)){ 
	$user_existing = array();
	//TODO: upgrade to PHP 5.5.x necessary to use $passwordEncrypt = password_hash($password, PASSWORD_DEFAULT); 
	$passwordEncrypt = md5($password);
	
	// read entire lines and delet selected
	$data = file_get_contents("/var/secure/user.txt");
	$lines = explode(PHP_EOL, $data);
        $lineNo = 1;
	foreach($lines as $line)
	{
		$linesArray[$lineNo] = $line;
		$lineNo++;
	}
	unset($linesArray[$_POST["lineNumber"]]);
	$newData = implode("\n", $linesArray);
	
	if($fp = fopen("/var/secure/user.txt", 'w'))
	{
		if(fwrite($fp, $newData))
                {
                    fclose($fp);
                }
                else
                {
                    die("Could not write data to file");    
                }
        } else {
		die("Could not open file");        
	}
     	
	//write changed data in new line
	$userfile = fopen ("/var/secure/user.txt","a");
	fwrite($userfile, $username);
	fwrite($userfile, "|");
	fwrite($userfile, $passwordEncrypt);
	fwrite($userfile, "|");
	fwrite($userfile, $adminright);
	fwrite($userfile, "\n");
	fclose($userfile);
	
	$arr = array( 	
		'errorUsername' => $errorUsername,
		'loginstatus' => $loginstatus,
		'adminstatus' => $adminstatus
	);

		echo json_encode($arr);
}

if (($_POST["setget"] == 'delete')&&($adminstatus == true)){ 
	$user_existing = array();
	//TODO: upgrade to PHP 5.5.x necessary to use $passwordEncrypt = password_hash($password, PASSWORD_DEFAULT); 
	$passwordEncrypt = md5($password);
	
	// read entire lines and delet selected
	$data = file_get_contents("/var/secure/user.txt");
	$lines = explode(PHP_EOL, $data);
        $lineNo = 1;
	foreach($lines as $line)
	{
		$linesArray[$lineNo] = $line;
		$lineNo++;
	}
	unset($linesArray[$_POST["lineNumber"]]);
	$newData = implode("\n", $linesArray);
	
	if($fp = fopen("/var/secure/user.txt", 'w'))
	{
		if(fwrite($fp, $newData))
                {
                    fclose($fp);
                }
                else
                {
                    die("Could not write data to file");    
                }
        } else {
		die("Could not open file");        
	}
     	
	$arr = array( 	
		'loginstatus' => $loginstatus,
		'adminstatus' => $adminstatus
	);

		echo json_encode($arr);
}

?>
