var todaysDate;
var inspectorName = "";
var inspectSchemas = [];


var emptyDiv = function(myNode) {
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}
};

/*
 * This function generates and returns today date with the timestamp
 */
function timeStamp() {
	// Return current date, in Unix time, milliseconds since Jan 1, 1970
  return new Date().getTime();
}

var populateInspectFields = function() {

	var inspectTypeCombo = document.getElementById('inspectType'); 
	emptyDiv(inspectTypeCombo);

	// Retrieve time in Unix time format
	var epochDate = timeStamp();
	var userFriendlyDate = new Date(epochDate).toDateString();
	todaysDate = new String(epochDate);
    document.getElementById('date').innerHTML = "Date: " + userFriendlyDate;

    cb.User().getUser(function(err, body) { // This gets the inspector name to populate the Inspector Name div
    	if(err) {
    		blockUI(true, "Could not get inspector name: " + body);
    	} else {
    		inspectorName = body.name;
    		document.getElementById('inspector').innerHTML = "Name: " + body.name;
    	}
    });

    cb.Code().execute("GetObjectSchema", {}, function(err, data) {
		if(err) {
			console.log("Error: " + err);
		} else {
			var response = data.results;

			if(!response.error) { 
				removeChildren('objectCategory');
				objectSchema = response.result;

				//build category dropdown
				for(var j = 0; j < response.result.length; j++) {
					var currentTagType = response.result[j].type;
					if(currentTagType == tagType){
						var currentTagActions = JSON.parse(response.result[j].actions);
						currentTagActions = currentTagActions[0].options;

						var objectCategory = document.getElementById('inspectType');
						for(var i = 0 ; i < currentTagActions.length ; i++){

							var opt = document.createElement('option');
							opt.innerHTML = currentTagActions[i];
							opt.value = currentTagActions[i];
							objectCategory.appendChild(opt);
						}
					}
				}

				getSpecifiedInspectSchema();

					
				//show schema for selected category
				// getFormObjects('inspectType');
			} else { // Code service thorws error, logout and go back to login page
				blockUI(true, response.result);
				logoutEvent();
				showView("login");
			}
		}
	});

    // Display tag action options
    // Set options
    // set action to getSpecifiedInspectSchema
    // getSpecifiedInspectSchema();

};

var getSpecifiedInspectSchema = function(){

	var eventInput = document.getElementById('inspectType').value;
	var params = {"action":eventInput};
    cb.Code().execute("GetInspectSchema", params, function(err, data) {
    	var response = data.results;

    	if(err){
    		switch(data){
    			// Unauthorized User attempting to access code service
    			case "Request Failed: Status 400 Bad Request\nmessage:Not Authorized\n":
	    			blockUI(true, "An inspector is not authorized to add tags.");
	    			showView("history");
	    			break;
	    		// Token has expired
	    		case "Request Failed: Status 0 ":
	    			blockUI(true, "Your session has expired. Please log in.");
	    			loginEvent();
	    			break;
	    		default:
	    			loginEvent();
	    			break;
	    	}
    	}
		else {
			inspectSchemas = response.result;
			getInspectObjects();
		}
    });
}

var getInspectObjects = function(){
	var inspectionFields = document.getElementById("inspectionFieldsDiv");
	emptyDiv(inspectionFields);
	var inspectionDropDown = document.getElementById("inspectType");
	for (var i = 0 ; i<inspectSchemas.length; i++){
		var inspectOption = JSON.parse(inspectSchemas[i].attributes);
		if (inspectSchemas[i].type == inspectionDropDown.value ) {
			//var attrs = Object.keys(inspectOption[i]);
			for (var j=0; j<inspectOption.length; j++) {
				var attr = inspectOption[j];//attrs[j];
				var input;
				if (attr.type == "textarea"){
					//create text area
					input = document.createElement('div');
					var label = document.createElement('p');
					label.innerHTML = attr.name;
					label.className = "headerLabel";
					input.appendChild(label);

					cinput = document.createElement('textarea');
					cinput.setAttribute("id", "inspect_"+attr.name);
					cinput.setAttribute("class", "textInput");
					// cinput.setAttribute("placeholder", attr.name);
					input.appendChild(cinput);
				}else if(attr.type =="combo"){
					var input = document.createElement('div');
					var label = document.createElement('p');
					label.innerHTML = attr.name;
					label.className = "headerLabel";
					input.appendChild(label);

					var select = document.createElement('select');
					select.setAttribute("id", "inspect_"+attr.name)
					select.setAttribute("class", "fullInput");

					for(var k = 0; k < attr.options.length; k ++) {
						var opt = document.createElement('option');
						opt.innerHTML = attr.options[k];
						opt.value = attr.options[k];
						select.appendChild(opt);
					}
					input.appendChild(select);
				}else {
					//treat it like a input
					input = document.createElement('input');
					input.setAttribute("id", "inspect_"+attr.name);
					input.setAttribute("class", "fullInput");
					input.setAttribute("placeholder", attr.name);
					input.setAttribute("type", "text");
				}
				inspectionFields.appendChild(input);
			}
		}
	}

	if(inspectionDropDown.value == "End Repair"){
		console.log("Get the open tickets.");
		var openTicketsId = "inspect_Work Ticket ID";
		cb.Code().execute("GetOpenWorkTickets", {tagid: tagID}, function(err, data) {
        if(err) {
            // Error
        } else {
            var tickets = data.results.result;

            if(tickets.length == 0){
            	var parent = document.getElementById(openTicketsId);
						var opt = document.createElement('option');
						opt.innerHTML = "No Open Tickets for this Tag";
						opt.value = 0;
						parent.appendChild(opt);
            }

        	for(var k = 0; k < tickets.length; k ++) {
        				var parent = document.getElementById(openTicketsId);
						var opt = document.createElement('option');
						var issue = tickets[k].details ? JSON.parse(tickets[k].details)["Breakdown/Issue"] : "";
							opt.innerHTML = tickets[k].work_ticket_id + " - Issue: " + issue;
						opt.value = tickets[k].work_ticket_id;
						parent.appendChild(opt);
					}

        }
    });
	}
	}

/*
 * This function gets all the history for the tag. It takes the latest added entry to the history table and appends it to the
 * history div on the homepage
 */
var addToHistory = function() {
	cb.Code().execute("GetTagHistory", {tagid: tagID}, function(err, data) {
		var response = data.results;

		if(!response.error) {
			var length = response.result.DATA.length;
			var getDiv = document.getElementById('taghistory'); // Get the history div
			var div = createDiv(response.result.DATA[length - 1]); // Create new div with the latest history entry
			getDiv.appendChild(div); // Append the newly created div the the parent div
		}
	});
}

var buildInspectDetails = function(){
	var ret = {};
	var inspectionDropDown = document.getElementById("inspectType");
	for (var i = 0 ; i<inspectSchemas.length; i++){
		var inspectOption = JSON.parse(inspectSchemas[i].attributes);
		if (inspectSchemas[i].type == inspectionDropDown.value ) {
			//var attrs = inspectOption[inspectionDropDown.value];
			for (var j=0; j<inspectOption.length; j++) {
				var attr = inspectOption[j];
				ret[attr.name]=document.getElementById("inspect_"+attr.name).value;
			}
		}
	}
	return ret;
}

/*
 * This gets executed upon submission of the inspect form. It stores the form inputs by calling the "StoreTagHistory" code service
 * After submission, it calls the "GetTagHistory" code service to get all the history for the tag and appemd the latest added
 * history entry to the history div
 */
var submitInspect = function() {
	var eventInput = document.getElementById('inspectType').value;
	// var comment = document.getElementById('textArea').value;
	var inspectDetails = buildInspectDetails();


	var tagHistoryParams = {
		'tag': tagID, 
		'event': eventInput, 
		'date': todaysDate, 
		'inspector': inspectorName, 
		'details': inspectDetails
	};

	if(inspectorName !== "") {
		cb.Code().execute("StoreTagHistory", tagHistoryParams, function(err, data) {
			var response = data.results;

			if(!response.error) {
				addToHistory();
				blockUI(true, response.result);
				showView("history");
			} else {
				showError("inspectSubmit", response.result);
			}
		});
	} 
	else {
		showError("inspectSubmit", "Cannot submit form. Could not get inspector name from the server. Please make sure you have entered your name in the 'Auth' tab on the ClearBlade console");
	}
}