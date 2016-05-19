function fsLogin(){
    window.userid="nobody";
    var login_url = freesound.getLoginURL();
    document.getElementById('loginFrame').src = login_url;
    document.getElementById('loginModal').style.display = 'block';
    return false;
}

function postAccessCode(code){
    freesound.postAccessCode(code,function(data,status,xhr){
        localStorage.setItem("access_token",data.access_token);
        localStorage.setItem("refresh_token",data.refresh_token);
        freesound.setToken(data.access_token,'oauth');
        document.getElementById('loginModal').style.display = 'none';
        getMe();
    });
}

function fsLogout(){
    var logout_url = freesound.getLogoutURL();
    var items = ["username","access_token","refresh_token"];
    for (var i = 0;i<items.length;i++)
        localStorage.removeItem(items[i]);
    setLoginLink();
}

function setLogoutLink(username){
    document.getElementById('logging_info').innerHTML = username + ', <a href="javascript:void(fsLogout())">Logout</a>';
}

function setLoginLink(){
    document.getElementById('logging_info').innerHTML = '<a href="javascript:void(fsLogin())">Login</a>';
}

function getMe(){
    freesound.me(function(data){
        setLogoutLink(data.username);
        window.username = data.username;
        localStorage.setItem("username",data.username);
    });
}

function closeLoginModal(){
    document.getElementById('loginModal').style.display = 'none';
}

(function () {
    // Initialize login: check if already logged in and set appropriate links
    var username = localStorage.getItem("username")
    if(username!=null){
        window.username=username;
        setLogoutLink(username);
        freesound.setToken(localStorage.getItem("access_token"),'oauth');
    } else {
        setLoginLink();
    }
})();



