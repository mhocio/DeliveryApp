//const uriUser = 'api/Users';
var currentUser;

function logInPress() {
    var id01 = document.getElementById('id01');
    var id02 = document.getElementById('id02');

    if (id02.style.display == 'inline')
        id02.style.display = 'none';

    if (id01.style.display == 'inline')
        id01.style.display = 'none';
    else
        id01.style.display = 'inline';

    var user_err = document.getElementById('user_err');
    user_err.style.display = 'none';
}

function signUpPress() {
    var id01 = document.getElementById('id01');
    var id02 = document.getElementById('id02');

    if (id01.style.display == 'inline')
        id01.style.display = 'none';

    if (id02.style.display == 'inline')
        id02.style.display = 'none';
    else
        id02.style.display = 'inline';

    var user_err = document.getElementById('user_err');
    user_err.style.display = 'none';
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
}

function userDisplay(addUname) {
    var user_log = document.getElementById('user_log');
    user_log.style.display = 'inline';
    currentUser = addUname.value.trim();
    var user = document.getElementById('user');
    user.style.display = 'inline';
    user.textContent = currentUser;
    var id01 = document.getElementById('id01');
    id01.style.display = 'none';
    var id02 = document.getElementById('id02');
    id02.style.display = 'none';
    var login = document.getElementById('login');
    login.style.display = 'none';
    var signup = document.getElementById('signup');
    signup.style.display = 'none';
    var logout = document.getElementById('logout');
    logout.style.display = 'inline';
    var user_actions = document.getElementById('user_actions');
    user_actions.style.display = 'block';
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
        })
        .catch(error => console.error('Unable to get item.', error));
}