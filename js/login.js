var isLoggedIn = false;

// RR TODO: We are setting this global postLoginView value from many other 
//    locations in the code. Let's instead add a parameter to #loginEvent
//    method signature

var postLoginView = DEFAULT_POST_LOGIN_VIEW;
var loginEvent = function() {
	var initCallback = function(err, data){
        if(err) {
            showError("login", data);
        } else {
            localStorage.setItem("email", data.email);  // Store login email
            localStorage.setItem("token", data.authToken);  // Store login authToken
            isLoggedIn = true;
            showView(postLoginView);
        }
    };
    
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
        initOptions.callback = initCallback;
        cb.init(initOptions);
    }
}