var DEFAULT_POST_LOGIN_VIEW = "history";

var cb = new ClearBlade();
var params = {};
var historyInit = false;



var views = {
    login: {
      setup: function() {

        // RR Do not show back if not logged in
        // setTitleLeft("Back");
        // setTitleCenter("<div class='titleLabel' > <img src='img/hidlogo.png'/></div>");
        // setTitleRight("");
        // titleLeftClick = function() {
      	 // showView("history");
        // }

      } 
    },
    history: {
    	setup: function() {

            if( ! historyInit){
              startHistory();
              historyInit = true;
            }

            var titleLogoutFlag = false;
            if(localStorage.getItem("email") !== null && localStorage.getItem("token") !== null) {
              setTitleLeft("Logout");
              titleLogoutFlag = true;
            } else {
              setTitleLeft("");
            }
            setTitleCenter("<div class='titleLabel' > <img src='img/hidlogo.png'/></div>");
            setTitleRight("Inspect");
            titleRightClick = function() {
              if(!isLoggedIn) {
                if(localStorage.getItem("email") !== null && localStorage.getItem("token") !== null) {
                  isLoggedIn = true;
                  cb.setUser(localStorage.getItem("email"), localStorage.getItem("token"));
                  showView("inspect");
                } else {
                  postLoginView = "inspect";
            	   showView("login");
                }
              } else {
                showView("inspect");
              }
            }
            if(titleLogoutFlag) {
              titleLeftClick = function() {
                logoutEvent();
                showView("login");
              }
            }
    	}
    },
    inspect: {
      setup: function() {
            populateInspectFields();
            setTitleLeft("Back");
            setTitleCenter("<div class='titleLabel' ><img src='img/hidlogo.png'/></div>");
            setTitleRight("Logout");
            titleLeftClick = function() {
              // alert("Inspecting");
              showView("history");
            };
            titleRightClick = function() {
              logoutEvent();
              showView("history");
            }
      }
    },
    tagErr: {
      setup: function() {
            setTitleLeft("");
            setTitleCenter("<div class='titleLabel' ><img src='img/hidlogo.png'/></div>");
            setTitleRight("");
      }
    },
    addTag: {
      setup: function() {


          var authCallback = function(){
            populateAddTagFields();
            setTitleLeft("");
            setTitleCenter("<div class='titleLabel' ><img src='img/hidlogo.png'/></div>");
            setTitleRight("Logout");
            titleRightClick = function() {
              logoutEvent();
              showView("login");
            }
          };

          var noAuthCallback = function(){
            showView("login");
          }

          checkAuth(authCallback, noAuthCallback)

      }
    }
};

var okEvent = function() {
  blockUI(false);
}

var startup = function() {


	var initCallback = function(err, data){
    blockUIInit(false);
    if(err) {
        // this path should not happen and would only happen with a misconfigured system or server outage
        showView("tagErr");
    } else {

          var authCallback = function(){
    	       // startHistory();
             showView("history");
          };

          var noAuthCallback = function(){
            showView("login");
          }

          checkAuth(authCallback, noAuthCallback)


    }



  };
	initOptions.callback = initCallback;
  blockUI(false);
  blockUIInit(true, "initalizing");
  cb.init(initOptions);


}