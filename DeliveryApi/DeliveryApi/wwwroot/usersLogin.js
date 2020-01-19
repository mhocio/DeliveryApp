//const uriUser = 'api/Users';
var currentUser = "";

function logInPress() {
    var user_err = document.getElementById('user_err');
    user_err.style.display = 'none';


    var overlay = document.getElementById('overlay-login');
    overlay.classList.remove('fadeOut');
    overlay.classList.add('open');
}

function signUpPress() {
    var user_err = document.getElementById('user_err');
    user_err.style.display = 'none';

    var overlay = document.getElementById('overlay-register');
    overlay.classList.add('open');
}

function redirectToRegister() {
    var old_overlay = document.getElementById('overlay-login');
    old_overlay.classList.remove('open');

    signUpPress();
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
    var user_actions = document.getElementById('user_actions');
    user_actions.style.display = 'none';

    getItems();
    getBase();

    document.getElementById("showRouteUserButton").classList.remove("pulse");
}

function userDisplay(addUname) {
    var user_log = document.getElementById('user_log');
    user_log.style.display = 'inline';
    currentUser = addUname.value.trim();
    var user = document.getElementById('user');
    user.style.display = 'inline';
    user.textContent = currentUser;

    var login = document.getElementById('login');
    login.style.display = 'none';
    var signup = document.getElementById('signup');
    signup.style.display = 'none';
    var logout = document.getElementById('logout');
    logout.style.display = 'inline';
    var user_actions = document.getElementById('user_actions');
    user_actions.style.display = 'block';

    getItems();
    getBase();
}

function handleUserErrors(response) {
    var user_err = document.getElementById('user_err');
    if (!response.ok) {
        if (response.status == 404) {
            user_err.style.display = 'inline';
            user_err.textContent = "Wrong username or password!";
            throw Error(response.statusText);
        }
        if (response.status = 400) {
            user_err.style.display = 'inline';
            user_err.textContent = "Username taken!";
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
        .then(() => {
            userDisplay(addUname);
            closeOverlay_register();
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
        .then(() => {
            userDisplay(logUname);
            closeOverlay_login();
            document.getElementById("showRouteUserButton").classList.add("pulse");
        })
        .catch(error => console.error('Unable to get item.', error));
}

function displayMyDeli() {
    const items = deliveries.filter(item => item.username === currentUser);
    clearTable();
    justDisplayItems(items);
}