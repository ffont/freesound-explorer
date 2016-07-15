var login_url = '/login/freesound/';
var logout_url = '/logout/';
var prepare_auth_url = '/prepare_auth/';
var get_app_token_url = '/get_app_token/'


function fsLogin(){
    document.getElementById('loginFrame').src = login_url;
    document.getElementById('loginModal').style.display = 'block';
    return false;
}

function fsLogout(){
    loadJSON(logout_url, function(data) {
        console.log(data);
        clearSession();
        setLoginLink();
    });
}

function setLogoutLink(){
    document.getElementById('logging-info').innerHTML = sessionStorage.getItem('username') + ', <a href="javascript:void(fsLogout())">Logout</a>';
}

function setLoginLink(){
    document.getElementById('logging-info').innerHTML = '<a href="javascript:void(fsLogin())">Login</a>';
}

function closeLoginModal(){
    document.getElementById('loginModal').style.display = 'none';
}

function setSessionStorage(access_token, username){
    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("username", username);
}

function clearSession(){
    var items = ["username", "access_token"];
    for (var i = 0;i<items.length;i++)
        sessionStorage.removeItem(items[i]);
}

function getAppToken(){
    loadJSON(get_app_token_url, function(data) {
        sessionStorage.setItem("app_token", data.app_token);
    }, function(){
        console.log("Using static app token");
        sessionStorage.setItem("app_token", "eecfe4981d7f41d2811b4b03a894643d5e33f812");
    });
}

function prepareAuth(){
    clearSession();  // Just in case some data was living in the site
    getAppToken();
    loadJSON(prepare_auth_url, function(data) {
        console.log("This instance of Freesound Explorer supports end user authentication :)");
        setSessionStorage(data.access_token, data.username);
        if (data.logged == true){
            setLogoutLink();
        } else {
            setLoginLink();
        }
    }, function(){
        supports_end_user_auth = false;
        console.log("This instance of Freesound Explorer does not support end user authentication");
    });
}

prepareAuth();  // Called at the beginning to set user data in session storage if user is authenticated
