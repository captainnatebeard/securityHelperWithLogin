<?php

/**
    * This is the main function, it runs through the script in a clean readable way.
    * This script accepts 4 POST parameters (newuser, newpass, username, and password)
    * This script interacts with a mysql database and depending on which parameters are set,
    * either creates a new user in the database or a user/password combination against the users
    * and their corresponding hashes.
    * if the username/password combination are correct then this script outputs a JSON object
    * with "verified" being set to TRUE
    * if the parameters are newuser and newpass, then it outputs a JSON object with
    * "userAdded" being set equal to TRUE
*/
function main() {
    include("config.php");

    try {
        $database = new PDO($ds, $db_user, $db_password);
        $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $exception) {
        display_error("cannot connect to the database", $exception);
    }
    if(isset($_POST["newuser"])){
        $new_user = $_POST["newuser"];
        if(isset($_POST["newpass"])){
            $new_pass = $_POST["newpass"];
            add_user($new_user, $new_pass, $database);
        }
    }
    if(isset($_POST["username"])) {
        $user = $_POST["username"];
        if(isset($_POST["password"])) {
            $pass = $_POST["password"];
            verify_creds($user, $pass, $database);
        }
    }
}

/**
    * queries the users database in a secure way for the corresponding hash for the user supplied
    * username and outputs a JSON encoded object with "verified" being set equal to TRUE if the
    * hash matches the user supplied password and FALSE if not
    * @param {string} $user - the users user name
    * @param {string} $pass - the users password
    * @param {PDO-object} $database - the PDO object for use in querying the database
*/
function verify_creds($user, $pass, $database){
    $verified = FALSE;
    try{
        $query = "SELECT hash FROM Login WHERE username = :username;";
        $stmt = $database->prepare($query);
        $param = array("username" => $user);
        $stmt->execute($param);
        $db_hash = $stmt->fetch();
        if(password_verify($pass, $db_hash[0])) {
            $verification[] = array("verified" => TRUE);
        } else {
            $verification[] = array("verified" => FALSE);
        }
        print json_encode($verification);
    }
    catch (PDOException $exception) {
        display_error("Sorry, the provided credentials are incorrect", $exception);
    }

}

/**
    * queries the users database in a secure way adding a new user to the Login table
    * and outputting a JSON object with "userAdded" being set equal to TRUE.
    * @param {string} $new_user - the user supplied new user name
    * @param {string} $new_pass - the user supplied new password
    * @param {PDO-object} $database - the PDO objet for use in querying the mysql users database
*/
function add_user($new_user, $new_pass, $database){
    $new_hash = password_hash($new_pass, PASSWORD_DEFAULT);
    try{
        $query = "INSERT INTO Login (username, hash) VALUES (:user, :hash );";
        $stmt = $database->prepare($query);
        $params = array("user" => $new_user,
                         "hash" => $new_hash);
        $stmt -> execute($params);
        header("Content-type: application/json");
        print json_encode(Array("userAdded" => TRUE));
    }
    catch (PDOException $exception) {
        display_error("User couldn't be added to database", $exception);
    }
}

/**
    * displays a unique error message depending on the situation, and exception thrown
    * @param {string} $error_message - a unique error message
    * @param {string} $exception - the exception thrown
*/
function display_error($error_message, $exception) {
    global $debug;
    if ($debug) {
        $error_message .= "Error: $exception \n";
    }
    header("HTTP/1.1 400 Invalid Request");
    header("Content-Type: text/plain");
    print($error_message);
    die();
}
main();
?>
