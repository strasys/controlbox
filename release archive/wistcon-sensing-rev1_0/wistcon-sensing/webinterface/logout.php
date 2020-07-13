<?php 
include_once ('privateplc_php.ini.php');
session_start();
unset($_SESSION['username']);
unset($_SESSION['admin']);
session_destroy();

if(isset($_COOKIE['rememberme']))
{
	setcookie("rememberme",'', time()-60*60*24*10);
}

$file = file_get_contents('index.html');
echo $file;
?>
