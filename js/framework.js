function getElementsByClassName(classname) {
    if(!document.getElementsByClassName) {
      return document.querySelectorAll("." + classname);
    }else {
      return document.getElementsByClassName(classname);
    }
}



function stopPropagation(e) {
    if(e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.returnValue = false;
    }    
}

var currentView = "";

var showView = function(viewToShow) {
    for(var view in views) {
        if(view === viewToShow) {
            document.getElementById(viewToShow).className = "";
            views[view].setup();
            currentView = view;
        } else {
            document.getElementById(view).className = "hidden";
        }
    }
}

var setActiveButton = function(viewToShow){
  for(var view in views) {
        if(view === viewToShow) {
            document.getElementById(viewToShow+"Button").setAttribute('style', 'color: white;background-color: #4CAF50;');
        } else {
            document.getElementById(view+"Button").setAttribute('style', '');
        }
    }
}

var setLoggedInAs = function(loggedIn){
  var loginButton = "loginButton";
  var logoutButton = "logoutButton";
  if(loggedIn){
    document.getElementById(loginButton).className = "hidden";
    document.getElementById(logoutButton).className = "";
  }
  else{
    document.getElementById(loginButton).className = "";
    document.getElementById(logoutButton).className = "hidden";
  }
}

var showError = function(view, message){
	 document.getElementById(view+"Error").innerHTML = message;
}

var setTitleSection = function(section, content){
    document.getElementById(section).innerHTML= content;
    if (content===""){
        document.getElementById(section).style.display = "none";
    } else {
        document.getElementById(section).style.display = "inline";
    }
};

var setTitleLeft = function(content){
    setTitleSection("titleLeft", content);
};

var titleLeftClick = function() {};

var setTitleCenter = function(content){
    setTitleSection("titleCenter", content);
};


var titleCenterClick = function() {};

var setTitleRight = function(content){
    setTitleSection("titleRight", content);
};

var titleRightClick = function() {};

var blockUIState = false;
var blockUIInitState = false;

var blockUI = function(flag, msg){
  blockUIState = flag;
    if (flag){
        var bodyRect = document.body.getBoundingClientRect()
        document.getElementById("loadingScreen").style.height="100%";
        document.getElementById("loadMessage").innerHTML=msg;
        document.getElementById("loadingScreen").style.top= ""+ (bodyRect.top*-1) +"px";
        document.getElementById("loadingScreen").style.display="block"; 
        
        disableScroll();
        
   } else{
        document.getElementById("loadingScreen").style.display="none";
        enableScroll()
   }
    
}

var blockUIInit = function(flag, msg){
  blockUIInitState = flag;
    if (flag){
        var bodyRect = document.body.getBoundingClientRect()
        document.getElementById("loadingScreenInit").style.height="100%";
        document.getElementById("loadMessageInit").innerHTML=msg;
       // document.getElementById("loadingScreenInit").style.top= ""+ (bodyRect.top*-1) +"px";
        document.getElementById("loadingScreenInit").style.display="block"; 
        
        disableScroll();
        
   } else{
        document.getElementById("loadingScreenInit").style.display="none";
        enableScroll()
   }
    
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function addListener(element, eventName, handler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false);
  }
  else if (element.attachEvent) {
    element.attachEvent('on' + eventName, handler);
  }
  else {
    element['on' + eventName] = handler;
  }
}

function removeChildren(element) {
  while (element.firstChild) {
      element.removeChild(element.firstChild);
  }
}

  var checkAuth = function(successCallback, errorCallback){
    var email = localStorage.getItem("email");
    var token = localStorage.getItem("token");

    // User has previously logged in
    if(email !== null &&  token !== null) {
        cb.setUser(email, token);
        cb.isCurrentUserAuthenticated(function(err, body){
          if(err){
            // Cannot authenticate
            errorCallback();
          }
          else{
            // User is logged in
            successCallback();
          }
        });
      }
    // No login data found
    else{
      errorCallback();
    }
  }

  function snakeCaseToHumanCase(input){
    var output = ""
    var split = input.split("_")
    for(var i = 0 ; i < split.length ; i++){
      var segment = split[i] 
      var capitalized = ""
      if (segment.length >= 1){
        var capitalized = (segment.charAt(0).toUpperCase() + segment.slice(1))
      }
      output += capitalized
      if(i < split.length - 1){
        output += " "
      }
    }
    return output

  }