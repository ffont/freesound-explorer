var login_url = "";

function fsLogin(){
    document.getElementById('loginFrame').src = login_url;
    document.getElementById('loginModal').style.display = 'block';
    return false;
}

function fsLogout(){
    // TODO: Call logout in backend
    setLoginLink();
}

function setLogoutLink(username){
    document.getElementById('logging_info').innerHTML = username + ', <a href="javascript:void(fsLogout())">Logout</a>';
}

function setLoginLink(){
    document.getElementById('logging_info').innerHTML = '<a href="javascript:void(fsLogin())">Login</a>';
}

function closeLoginModal(){
    document.getElementById('loginModal').style.display = 'none';
}

function prepareAuthFlow(){
    loadJSON(function(data) { 
        login_url = data['authorize_url'];
        setLoginLink();
    }, '/oauth_urls');

}

prepareAuthFlow();
