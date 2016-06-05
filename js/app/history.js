var tagID, tagType, tac, isVerified;

var tagDetails = {};
var tagContact = {};
var tagAction = {};

var appendHistoryDetailsUI = function(parent, details){

	var keys = Object.keys(details);

	
	for(var i=0; i<keys.length; i++){

		var header = document.createElement('div');
		header.setAttribute('style', 'text-align:left;font-weight:bold;font-style:italic');

		var t = details[i];
		header.innerHTML = keys[i];
		parent.appendChild(header);

		var value = document.createElement('div');
		value.setAttribute('style', 'text-align:left;');

		value.innerHTML = details[keys[i]];
		parent.appendChild(value);

	}
};

/*
 * This gets the parent history div and appends children to it
 */
var createDiv = function(data) {
	var parentDiv = document.createElement('div');
	parentDiv.setAttribute('style', 'background-color:#C2CBCE;border-color:gray;border-width:1px;border-style:solid;padding:8px');
	
	var div1a = document.createElement('div');
	div1a.setAttribute('style', 'text-align:left;font-weight:bold;');
	div1a.innerHTML = "Event:";

	var div1b = document.createElement('div');
	div1b.setAttribute('style', 'text-align:left;');
	div1b.innerHTML = data.event;

	var div2a = document.createElement('div');
	div2a.setAttribute('style', 'text-align:left;font-weight:bold;');
	div2a.innerHTML = "Date:";

	var div2b = document.createElement('div');
	div2b.setAttribute('style', 'text-align:left;');
	var date = new Date();
	var timeStamp = parseInt(data.time);
    date.setTime(timeStamp);
	div2b.innerHTML = date;

	var div3a = document.createElement('div');
	div3a.setAttribute('style', 'text-align:left;font-weight:bold;');
	div3a.innerHTML = "Inspector:";

	var div3b = document.createElement('div');
	div3b.setAttribute('style', 'text-align:left;');
	div3b.innerHTML = data.inspector;



	var div5a = document.createElement('div');
	div5a.setAttribute('style', 'text-align:left;font-weight:bold;');
	div5a.innerHTML = "Details:";

	parentDiv.appendChild(div1a);
	parentDiv.appendChild(div1b);
	parentDiv.appendChild(div2a);
	parentDiv.appendChild(div2b);
	parentDiv.appendChild(div3a);
	parentDiv.appendChild(div3b);
	
	parentDiv.appendChild(div5a);

	appendHistoryDetailsUI(parentDiv, JSON.parse(data.details));

	if(data.event == "Start Repair"){
		var div4a = document.createElement('div');
		div4a.setAttribute('style', 'text-align:left;font-weight:bold;');
		div4a.innerHTML = "Work Ticket ID:";

		var div4b = document.createElement('div');
		div4b.setAttribute('style', 'text-align:left;');
		div4b.innerHTML = data.work_ticket_id;

		parentDiv.appendChild(div4a);
		parentDiv.appendChild(div4b);

	}

	return parentDiv;
}

/*
 * This fetches the tag history from the backend and creates divs within a parent div and adds history to it
 */
var getHistory = function() {
	cb.Code().execute("GetTagHistory", {tagid: tagID}, function(err, data) {
		var response = data.results;

		if(!response.error) {
			for(var i = 0; i < response.result.DATA.length; i++) {
				var getDiv = document.getElementById('taghistory');
				var div = createDiv(response.result.DATA[i]);
				getDiv.appendChild(div);

			}
		} else {
			document.getElementById('taghistory').innerHTML = response.result;
		}
	});
}

var setDetailsTitle = function(tag) {
	var tDiv = document.getElementById("historyDetailsTitle");
	tDiv.innerHTML = tag.type + " Details";
}
/*
 * This gets tag details like company name, contact, location, object type etc.
 */
var getTagDetails = function() {
	cb.Code().execute("GetTagDescription", {tag: tagID, tac: tac}, function(err, data) {
		var response = data.results;

		if(!response.error) {	// No error, tag details received
			// var json = JSON.parse(response.result.tagdetails);
			setDetailsTitle(response.result);

			tagType = response.result.type;
			tagDetails = JSON.parse(response.result.details);
			tagContact = JSON.parse(response.result.contact);
			// tagAction = JSON.parse(response.result.actions);
			

			document.getElementById('tagId').innerHTML = tagID;
			var parentDivContact = document.getElementById('contactDiv');
			var parentDetailsDiv = document.getElementById('detailsDiv');
			for(var j = 0; j < Object.keys(tagContact).length; j++) {
				var div1a = document.createElement('div');
				div1a.setAttribute("style", "text-align:left;font-weight:bold;");
				div1a.innerHTML = Object.keys(tagContact)[j];

				var div1b = document.createElement('div');
				div1b.setAttribute("style", "text-align:left");
				div1b.innerHTML = tagContact[Object.keys(tagContact)[j]];

				parentDivContact.appendChild(div1a);
				parentDivContact.appendChild(div1b);
			}
			for(var j = 0; j < Object.keys(tagDetails).length; j++) {
				var div2a = document.createElement('div');
					div2a.setAttribute("style", "text-align:left;font-weight:bold;");
					div2a.innerHTML = Object.keys(tagDetails)[j];

					var div2b = document.createElement('div');
					div2b.setAttribute("style", "text-align:left");
					div2b.innerHTML = tagDetails[Object.keys(tagDetails)[j]];

					parentDetailsDiv.appendChild(div2a);
					parentDetailsDiv.appendChild(div2b);
			}
		} else if(response.error && response.result === "No Tag found in collection") { // No errors but tag not found in the database
			isLoggedIn = true;
            cb.setUser(localStorage.getItem("email"), localStorage.getItem("token")); // Set the user in the ClearBlade object
            showView("addTag");
		} else {
			showView('tagErr'); // If error received from Code Service, show error
		}
	});
}

/*
 * This is the first function that executes after startup(). This gets the tag ID and tac from the URL query params and gets
 * the tag details and tag history if the tag is present in the database
 */
var startHistory = function() { 
	var url = window.location.href;
	//var getRequest = url.split('/')[3];
	var splitDemo = url.split('?');
	if (splitDemo.length>1 ){
		var params = splitDemo[1].split('&');
		var param = [];
		for (var i = 0; i < params.length; i++) {
	        var temp = params[i].split('=');
	        param[i] = temp[1];
		}
		
		tagID = param[0];
		tac = param[1];
		getTagDetails();
		getHistory();
		// showView("history");
	} else {
		showView('tagErr');
	}	
}

var flagTag = function(event){

}