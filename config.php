<?php
/**
    * Nathan Johnson
    * 11/29/18
    * This is the config.php file for use with the login page of my pentesters notes webshell
    * It provides the variables that are needed for a connection to the database
*/

error_reporting(E_ALL);
ini_set("display_errors", 1);

$db_user = "root";
$db_password = "root";
$host = "127.0.0.1";
$port = "3306";
$dbname = "users";
$debug = FALSE;
$ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";
?>
