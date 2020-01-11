function logInPress() {
    var id01 = document.getElementById('id01');
    var id02 = document.getElementById('id02');

    if (id02.style.display == 'inline')
        id02.style.display = 'none';

    if (id01.style.display == 'inline')
        id01.style.display = 'none';
    else
        id01.style.display = 'inline';
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
}

function logOutPress() {
    var login = document.getElementById('login');
    login.style.display = 'inline';
    var signup = document.getElementById('signup');
    signup.style.display = 'inline';
    var logout = document.getElementById('logout');
    logout.style.display = 'none';
    var user = document.getElementById('user');
    user.style.display = 'none';
    user.innerText = '';
    currentUser = '';
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
        .then(response => response.json())
        .then(() => {
            currentUser = addUname.value.trim();
            var user = document.getElementById('user');
            user.style.display = 'inline';
            user.textContent = currentUser;
        })
        .catch(error => console.error('Unable to add item.', error));

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
}

function logIn() {
    const logUname = document.getElementById('uname');
    const logPsw = document.getElementById('psw');

    var urilog = uriUser + "/byUser/" + logUname.value.trim() + "/" + logPsw.value.trim();

    fetch(urilog)
        .then(response => response.json())
        .then(() => {
            currentUser = logUname.value.trim();
            var user = document.getElementById('user');
            user.style.display = 'inline';
            user.textContent = currentUser;
        })
        .catch(error => console.error('Unable to get item.', error));

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
}