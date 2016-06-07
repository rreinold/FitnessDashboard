  var DEFAULT_POST_LOGIN_VIEW = "visualize";

  function okEvent() {
    blockUI(false);
  }

function showMainDashboard(){
    showView("maindashboard");
  }

  function showVisualize(){
    showView("visualize");
  }

  function showCheckIn (){
    showView("checkin");
  }

  function showLogin(){
    showView("login");
  }

  function showLogout(){
    showView("logout");
  }

  function showGoals(){
    showView("goals")
  }

  function initButtons (){
    setActiveButton(DEFAULT_POST_LOGIN_VIEW);
    setLoggedInAs(false);
  }


  // RR TODO: Move startup here