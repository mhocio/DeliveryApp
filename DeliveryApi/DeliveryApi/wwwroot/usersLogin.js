//const uriUser = 'api/Users';
var currentUser = "";

function logInPress() {
    var overlay = document.getElementById('overlay-login');
    overlay.classList.remove('fadeOut');
    overlay.classList.add('open');
}

function signUpPress() {
    var overlay = document.getElementById('overlay-register');
    overlay.classList.add('open');
}

function redirectToRegister() {
    var old_overlay = document.getElementById('overlay-login');
    old_overlay.classList.remove('open');

    signUpPress();
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function handleReloadErrors(response) {
    if (!response.ok)
        throw Error(response.statusText);
    return response;
}

function reloadUser() {
    var user = getCookie("user");
    //console.log(user);

    if (user != '') {
        var urilog = uriUser + "/bySecure/" + user;

        fetch(urilog)
            .then(handleReloadErrors)
            .then(response => response.json())
            .then((data) => {
                userDisplay(data.username);
            })
            .catch(error => console.error('Unable to get item.', error));
    }
}


function logOutPress() {
    var login = document.getElementById('login');
    login.style.display = 'inline';
    var signup = document.getElementById('signup');
    signup.style.display = 'inline';
    var logout = document.getElementById('logout');
    logout.style.display = 'none';
    var user_log = document.getElementById('user_log');
    user_log.style.display = 'none';
    var user = document.getElementById('user');
    user.style.display = 'none';
    user.innerText = '';
    currentUser = '';

    document.getElementById("showRouteUserButton").style.display = 'none';

    getItems();
    getBase();

    setCookie("user", currentUser);

    document.getElementById("showRouteUserButton").classList.remove("pulse");
}

function userDisplay(Uname) {
    var user_log = document.getElementById('user_log');
    user_log.style.display = 'inline';
    currentUser = Uname;

    var user = document.getElementById('user');
    user.style.display = 'inline';
    user.textContent = currentUser;

    var login = document.getElementById('login');
    login.style.display = 'none';
    var signup = document.getElementById('signup');
    signup.style.display = 'none';


    var logout = document.getElementById('logout');
    logout.style.display = 'inline';

    document.getElementById("showRouteUserButton").style.display = 'inline';

    getItems();
    getBase();
}

function handleUserErrors(response) {
    if (!response.ok) {
        if (response.status == 404) {

            const myNotification = window.createNotification({
                theme: "error",
                closeOnClick: true,
			    displayCloseButton: true,
            });
            myNotification({
                message: "Wrong username or password!",
                title: "Login error"
            });  

            throw Error(response.statusText); 

        }
        if (response.status = 400) {

            const myNotification = window.createNotification({
                theme: "error",
                closeOnClick: true,
			    displayCloseButton: true,
            });
            myNotification({
                message: "Username taken!",
                title: "Register error"
            }); 

            throw Error(response.statusText);
        }
    }
    user_err.style.display = 'none';
    return response;
}

function signUp() {
    const addUname = document.getElementById('uname_s');
    const addPsw = document.getElementById('psw_s');

    const item = {
        username: addUname.value.trim(),
        password: addPsw.value.trim()
    };

    fetch(uriUser, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(handleUserErrors)
        .then(response => response.json())
        .then((data) => {
            userDisplay(addUname.value.trim());
            closeOverlay_register();

            console.log(data);
            setCookie("user", data.secureString);

            document.getElementById("showRouteUserButton").classList.add("pulse");
        })
        .catch(error => console.error('Unable to add item.', error));
}

function logIn() {
    const logUname = document.getElementById('uname');
    const logPsw = document.getElementById('psw');

    var urilog = uriUser + "/byUser/" + logUname.value.trim() + "/" + logPsw.value.trim();

    fetch(urilog)
        .then(handleUserErrors)
        .then(response => response.json())
        .then((data) => {
            userDisplay(logUname.value.trim());
            closeOverlay_login();

            setCookie("user", data.secureString);

            document.getElementById("showRouteUserButton").classList.add("pulse");
        })
        .catch(error => console.error('Unable to get item.', error));
}

document.addEventListener("DOMContentLoaded", reloadUser, false);