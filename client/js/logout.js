var logoutEvent = function() {
	isLoggedIn = false;
	if(localStorage.getItem("email") !== null && localStorage.getItem("token") !== null) { // Remove email and authtoken if present in local storage
		localStorage.removeItem("email","");
		localStorage.removeItem("token","");
	}

	cb.logoutUser(function(err, data) {
		if(err) {
			//alert(data);
		} else {
			isLoggedIn = false;
		}
	})
}