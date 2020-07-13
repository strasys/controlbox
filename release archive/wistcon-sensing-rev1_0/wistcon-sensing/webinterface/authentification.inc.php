<?php
unset($loginstatus);
unset($adminstatus);
unset($flag);

if(!isset($_SESSION['username']) && !isset ($_COOKIE['rememberme']))
{
	$loginstatus = false;
	$adminstatus = false;
	$flag = false;
}
elseif(isset($_SESSION['username']))
{
	$adminstatus = false;
	$loginstatus = true;
	$flag = true;
	if(isset($_SESSION['admin']))
	{
		$adminstatus = true;
	}

}
elseif(isset($_COOKIE['rememberme']) && !isset($_SESSION['username']))
{
	list($username, $token, $mac) = explode(":", $_COOKIE['rememberme']);

	$staylogedinfile = fopen ("/var/secure/userlogedin.txt","r");
	if ($staylogedinfile)
	{
		//check if user does exist in "userlogedin.txt"
		while (!feof($staylogedinfile))
		{
			$line = fgets($staylogedinfile, 500);
			$userdata1 = explode(":", $line);

			if ($userdata1[0] == $username)
			{
				$token_database = trim($userdata1[1]);
				$secret_key = "j/LfE09cUeJ9QXiP8i6IjdXIoYZZZhFKSYreymf3";

				$mac_database = hash_hmac('sha256', trim($username) . ":" . trim($token), $secret_key);
				
				if ($mac_database == trim($mac))
				{
					$_SESSION['username'] = $username;
					$loginstatus = true;
					$adminstatus = false;
					$flag = true;
					break 1;
				}
				else
				{
					$loginstatus = false;
					$adminstatus = false;
					$flag = false;
					break 1;
				}
			}
		}
	}
	fclose($staylogedinfile);
}

?>
