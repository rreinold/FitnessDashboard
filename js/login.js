var isLoggedIn = false;

function loginCallback(err, data){
        if(err) {
            showError("login", data);
        } else {
            localStorage.setItem("email", data.email);  // Store login email
            localStorage.setItem("token", data.authToken);  // Store login authToken
            isLoggedIn = true;
            showView(postLoginView);
        }
    };

var postLoginView = DEFAULT_POST_LOGIN_VIEW;
var loginEvent = function() {
    var email = document.getElementById("email").value;
    var email = email.toLowerCase();
    var password = document.getElementById("password").value;
    // Clear password
    document.getElementById("password").value = "";
    if(email === "" || password == "") {
        showError("login", "Both email and password must be present");
    } else {
        initOptions.email = email;
        initOptions.password = password;
        initOptions.callback = loginCallback;
        cb.init(initOptions);
    }
}