<?php
include_once ('privateplc_php.ini.php');
session_start(); 
unset ($username, $password, $rememberlogin);
$rememberlogin = 0;
$username = $_POST["username"]; 
$password = $_POST["password"];
$rememberlogin = $_POST["rememberlogin"];
//$username = "strajoha";
//$password = "1234";
$passwordEncrypt = md5($password); 
unset($arr);
unset($errorFile, $errorUsername, $errorPasswordRepeat);
$errorFile = 1; //If errorFile variable = -1 than fopen is False
$errorUsername = 1; //If username does not exist variable = -1
$errorPassword = 1; //If password is wrong value = -1

$userfile = fopen("/var/secure/user.txt","r"); 

	if ($userfile == FALSE)
	{
		$errorFile = -1;
		transfer_javascript($errorFile, $errorUsername, $errorPassword, $username);
		exit;
	}

//search user file if username matches
	while (!feof($userfile)) 
	{ 
	$line = fgets($userfile,500); 
	$userdata = explode("|", $line); 

		if (($userdata[0]==$username))
		{
			if ($passwordEncrypt==trim($userdata[1]))
			{
				$_SESSION['username'] = $username;
		
				if (trim($userdata[2])=="admin")
				{
					$_SESSION['admin'] = "admin";
				
				}
				
			}
			else
			{
				$errorPassword = -1;
			}
			transfer_javascript($errorFile, $errorUsername, $errorPassword, $username);
			fclose($userfile);
			break 1;
		}
		
		if (($userdata[0]!=$username) && (feof($userfile)))
		{
			$errorUsername = -1;
			$errorPassword = -1;
			transfer_javascript($errorFile, $errorUsername, $errorPassword, $username);
			fclose($userfile);
			break 1;
		}	
	}

	if ($rememberlogin == 1)
	{
		
		//generate salt
		unset($randompartofsalt);
		exec("head -c20 /dev/urandom | base64", $randompartofsalt);
		//echo "nach system" . $randompartofsalt[0] . "<br>";
		/*
		for ($i=0; $i<=22; $i++)
		{
			$randompartofsalt .= rand(0,$characters-1);
		}
		*/

		$salt = '$2y$15$' . $randompartofsalt[0] .'$';
		//echo "salt" . $salt . "<br>";
		$cookie = $username . ":" . $salt; 
		
		//generate hashed username incl. salt to safe in cookie
		//$saltedusername = $salt . $username . $salt;
		
		$secret_key = "j/LfE09cUeJ9QXiP8i6IjdXIoYZZZhFKSYreymf3"; 
		//TODO: Write routine to store and generate it initially
		//the key was on linux generated: "head -c 32 /dev/random | base64"
		$mac = hash_hmac('sha256', $cookie, $secret_key);
		//echo "mac = ".$mac."<br>";
		$cookie .= ":" . $mac;
		
		//cookie expires after 10 days 
		setcookie("rememberme",$cookie, time()+60*60*24*10);
	
		
		//store individual salt in database
		//look if user is allready stoard in data base
		$usernameexistslogedin = false;	
		
	//	if (!file_exists('userlogedin.txt'){
	//		exec('file="./userlogedin.txt"');
	//		exec('chown root:www-data userlogedin.txt');
	//		exec('chmod g+rw userlogedin.txt');
	//	}
		
		
		$staylogedinfile = fopen ('/var/secure/userlogedin.txt','r');
		if ($staylogedinfile)
		{
		
		//check if user does already exist in "userlogedin.txt"
			while (!feof($staylogedinfile))
			{
				$line = fgets($staylogedinfile, 500);
				$userdata1 = explode(":", $line);
				
				if ($userdata1[0] == $username)
				{
					$usernameexistslogedin = true;
					break 1;
				}
			}
			fclose($staylogedinfile);
			
			if ($usernameexistslogedin)
			{
				unset($arstaylogedinfile);	
				$arstaylogedinfile = array();
				$ar = file("/var/secure/userlogedin.txt");
				
				$i = 0;
				foreach ($ar as $line)
				{
					$line = trim($line);
					list($user, $token) =  explode(":", $line);
					$arstaylogedinfile[$i] = $user;
					$arstaylogedinfile[$i+1] = $token;
					$i=$i+2;
				}
			//	echo "arstaylogdinfile".print_r($arstaylogedinfile)."<br";
				//find user and replace token
				$key = array_search($username, $arstaylogedinfile);
				
				//echo "key = ".$key."<br>";
				
				$arstaylogedinfile[$key + 1] = $salt;
				
				$f = fopen("/var/secure/userlogedin.txt", 'w');
				
				$n = count($arstaylogedinfile);
				if ($f) //add error code
				{
					for ($i = 0; $i<=$n-1; $i+=2)
					{
						fwrite($f,$arstaylogedinfile[$i].":".$arstaylogedinfile[$i+1]."\n");
					}
					
				}
				fclose($f);
				
			}
			else
			{
			$staylogedinfile = fopen ("/var/secure/userlogedin.txt","a");
			fwrite($staylogedinfile, $username.":".$salt."\n");
			fclose($staylogedinfile);
			}
		}
	}	
	
	
function transfer_javascript($errorFile, $errorUsername, $errorPassword, $username)	
{
	$arr = array( 	'errorFile' => $errorFile,
					'errorUsername' => $errorUsername,
					'errorPassword' => $errorPassword,
					'username' => $username
				);
	
	echo json_encode($arr);
}
	?>
