/**
	* Nathan Johnson
    * 11/29/18
    * CSE 154
	* This is the javascript for the login page for the webshell page of my pentesters notes website
    * It sends multiple fetch requests to the login.php backend api, one to login and another
    * to add a user to the database.  In both cases these are POST requests to help with the
    * anonymity of the login process.  The root user username is "root" and the password is "root"
*/
(function() {
    "use strict";
    const URL = "login.php";
    window.addEventListener("load", initialize);

    /**
        * Initializes the buttons on the page, adding listeners to each.
    */
    function initialize() {
        $("login-btn").addEventListener("click", checkCreds);
        $("create-btn").addEventListener("click", createCreds);
        $("submit-new-btn").addEventListener("click", submitNewCreds);
        $("to-main-btn").addEventListener("click", backToMain);
    }

    /**
        * makes a POST request to the backend php api with the given username and password from
        * the login fields
    */
    function checkCreds() {
        let password;
        let username;
        if(qsa(".login")[1].value) {
            password = qsa(".login")[1].value;
        }
        if(qsa(".login")[0].value) {
            username = qsa(".login")[0].value;
        }
        if(password && username) {
            let params = new FormData;
            params.append("password", password);
            params.append("username", username);
            fetch(URL, {
                method: "post",
                body: params})
            .then(checkStatus)
            .then(JSON.parse)
            .then(checkVerification)
            .catch(console.log);
        } else {
            credsNotSet(password, username, password);
        }
    }

    /**
        * runs in case any of the login fields or add user fields aren't filled in.  It prints
        * an error message to the screen letting the user know which input field has been forgotten
        * @param {string} password - the users password
        * @param {string} username - the users username
        * @param {string} repeatPass - the users password
    */
    function credsNotSet(password, username, repeatPass) {
        let errorSection = document.createElement("section");
        while(qs("main").children.length > 5) {
            qs("main").removeChild(qs("main").children[5]);
        }
        qs("main").appendChild(errorSection);
        if (!username){
            errorSection.innerText = " username field is required.  ";
        }
        if (!password){
            errorSection.innerText += " password field is required.  ";
        }
        if (!repeatPass && qsa("form")[0].classList[0] === "hidden"){
            errorSection.innerText += " repeat password field is required.  ";
        }
        if (repeatPass !== password){
            errorSection.innerText += " password fields do not match.  ";
        }
    }

    /**
        * recieves the api data from the backend php api and makes sure that the api suggests that
        * the password/user combination is verified.  If so, it passes the user on to the webshell
        * page
        * @param {object} - the api object in JSON format
    */
    function checkVerification(verification) {
        if(verification[0].verified) {
            window.location = "webshell.html";
        } else {
            let errorSection = document.createElement("section");
            while(qs("main").children.length > 5) {
                qs("main").removeChild(qs("main").children[5]);
            }
            qs("main").appendChild(errorSection);
            errorSection.innerText = "Incorrect Credentials, please try again.";
        }
    }

    /**
        * passes the user on to the part of the page that allows them to create a user by hiding
        * the current login form and displaying the "create user" form
    */
    function createCreds() {
        while(qs("main").children.length > 5) {
            qs("main").removeChild(qs("main").children[5]);
        }
        qsa("h1")[1].classList = "hidden";
        qsa("form")[0].classList = "hidden";
        qsa("h1")[2].classList = "";
        qsa("form")[1].classList = "";
    }

    /**
        * makes a POST request to the backend api with the new username and password as parameters
    */
    function submitNewCreds() {
        let password;
        let username;
        let repeatPass;
        if(qsa(".create-new")[1].value) {
            password = qsa(".create-new")[1].value;
        }
        if(qsa(".create-new")[0].value) {
            username = qsa(".create-new")[0].value;
        }
        repeatPass = qsa(".create-new")[2].value;
        if(password && username && repeatPass && (password === repeatPass)) {
            let params = new FormData;
            params.append("newuser", username);
            params.append("newpass", password);
            fetch(URL, {
                method: "post",
                body: params})
            .then(checkStatus)
            .then(JSON.parse)
            .then(userAdded)
            .catch(console.log);
        } else {
            credsNotSet(password, username, repeatPass)
        }
    }

    /**
        * checks to make sure that the user was successfully added by checking the api data
        * from the backend php api and displays a message saying that it was successful and a button
        * allowing the user to return to the login page.
        * @param {object} apiData - the api data from the backend api in JSON format
    */
    function userAdded(apiData){
        console.log(apiData);
        if (apiData.userAdded === true) {
            qs("div").classList = "";
        }
    }

    /**
        * hides the "create user" page and displays the login page
    */
    function backToMain(){
        qs("div").classList = "hidden";
        qsa("h1")[1].classList = "";
        qsa("form")[0].classList = "";
        qsa("h1")[2].classList = "hidden";
        qsa("form")[1].classList = "hidden";
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
