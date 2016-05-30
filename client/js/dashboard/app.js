  var DEFAULT_POST_LOGIN_VIEW = "maindashboard";

  // RR TODO: Add init here

  // // RR TODO: CheckAuth at every transition, simplest worth trying
  // var views = {
  //     login: {
  //       setup: function() {

  //         initButtons();

  //         var authCallback = function(){
  //           showView("maindashboard");
  //         };

  //         var noAuthCallback = function(){
  //           // RR: BlockUI not implemented yet
  //           // blockUI(true, "Failed to log in.")
  //           // showView("login");
  //         }

  //         checkAuth(authCallback, noAuthCallback)

  //       } 
  //     },
  //     logout: {
  //       setup: function() {

  //         logoutEvent();
  //         setActiveButton("maindashboard");
  //         setLoggedInAs(false);
  //       } 
  //     },
  //     maindashboard: {
  //     	setup: function() {

  //         // Check if has access
  //           setActiveButton("maindashboard");
  //           setLoggedInAs(true);

  //         var authCallback = function(){
  //           var hasAccessCallback = function(){
  //               startupMainDashboard();
  //           }
  //           var noAccessCallback = function(){
  //             // RR: BlockUI not implemented yet
  //             // blockUI(true, "You do not have access to this dashboard");
  //             // showView("login");
  //           }

  //           isCoordinator(hasAccessCallback, noAccessCallback);
  //         }
  //         var noAuthCallback = function(){
  //           // RR: BlockUI not implemented yet
  //           // blockUI("You do not have access.");
  //           showView("login");
  //         }

  //         checkAuth(authCallback, noAuthCallback);

  //     	}
  //     },
  //     workticketdashboard: {
  //       setup: function() {

  //         setActiveButton("workticketdashboard");
  //         setLoggedInAs(true);
  //         var authCallback = function(){
  //           startupWorkTicketDashboard();
  //         };

  //         var noAuthCallback = function(){
  //           showView("login");
  //         }

  //         checkAuth(authCallback, noAuthCallback)

  //       }
  //     },
  // };

  var okEvent = function() {
    blockUI(false);
  }

  var showMainDashboard = function(){
    showView("maindashboard");
  }

  var showCheckIn = function(){
    showView("checkin");
  }

  var showLogin = function(){
    showView("login");
  }

  var showLogout = function(){
    showView("logout");
  }

  var initButtons = function(){
    setActiveButton(DEFAULT_POST_LOGIN_VIEW);
    setLoggedInAs(false);
  }

  // RR TODO: Move startup here