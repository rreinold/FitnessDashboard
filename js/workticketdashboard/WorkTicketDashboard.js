
// TODO CSS-style organization
var DEFAULT_BREAKDOWNISSUE_COL_WIDTH = "250px";
var DEFAULT_ACTION_COL_WIDTH = "175px";
var DEFAULT_REMARKS_COL_WIDTH = "225px";
var DEFAULT_ISSUE_COMMENTS_WIDTH = "275px";

// TODO Organize into map
var START_REPAIR = "Start Repair";
var END_REPAIR = "End Repair";
var ISSUE_COMMENTS = "Issue Comments";
var ROOT_CAUSE = "Root Cause";
var ACTION = "Action";
var REMARKS = "Remarks";
var BREAKDOWNISSUE = "Breakdown/Issue";
var SHIFT = "Shift";
var MACHINE_STOP_TIME = "Machine Stop Time";

var MS_PER_HOUR = 3600000;

var workTicketTracker = {};

var startupCheckIn = function() {
	    	makeAPICalls();
};

// START logic helpers

// Load tag types into dropdown
// Uses the loaded schema for creating new Tag objects
var makeAPICalls = function(refreshTagSchemas){
			fetchUnmeasuredCheckIns(updateDropDown);
};

// Fill in grid with Tags from the selected schema
var updateDropDown = function (){
	var select = document.getElementById('checkInSelect');
	removeChildren(select)
	// Create jsGrid, load data and fields into it
	for(var j = 0; j < unmeasuredCheckIns.length; j ++) {
			var option = document.createElement('option');
			option.innerHTML = unmeasuredCheckIns[j].data.checkindate;
			option.value = unmeasuredCheckIns[j].data.checkindate;
			select.appendChild(option);
		}
}

var submitCheckIn = function() {
	var upload = {
		"weight": parseInt(document.getElementById('weight').value),
		"date" : document.getElementById('checkInSelect').value
	};
	console.log(upload)

	cb.Code().execute("AddCheckIn", upload, function(err, data) {
			var response = data.results;

			if(!response.err) {
				
				blockUI(true, response.result);
				showView("maindashboard");
			} else {
				showError("inspectSubmit", response.result);
			}
		});

}



// Action Due in field, which is derived from database data, need to
// be created manually on the client side.
var addActionDueField = function(fields, schema){
		fields.push({ name: actionDueConstants.GRID_KEY, type:"number", width:"110px"});
}


// Deconstruct the JSON schema into individual column fields
var buildTicketDataFields = function(){
	// Manually add fields
    fields = [
	    	{ name: "Work Ticket ID", type: "text"},
	    	{ name: "Completed",type: "checkbox"},
	    	{ name: "Date", type: "text"},
	    	{ name: SHIFT, type: "text"},
	    	{ name: BREAKDOWNISSUE, type: "text", width: DEFAULT_BREAKDOWNISSUE_COL_WIDTH},
	    	{ name: ISSUE_COMMENTS, type: "text", width: DEFAULT_ISSUE_COMMENTS_WIDTH},
	    	{ name: ACTION, type: "text", width: DEFAULT_ACTION_COL_WIDTH},
	    	{ name: MACHINE_STOP_TIME, type: "text"},
	    	{ name: "Start Time", type: "text"},
	    	{ name: "Finish Time", type: "text"},
	    	{ name: ROOT_CAUSE, type: "text"},
	    	{ name: "Total Time (hours)", type: "number"},
	    	{ name: "Inspector", type: "text"},
	    	{ name: REMARKS, type: "text", width: DEFAULT_REMARKS_COL_WIDTH}
    	];

	return fields;
}

// Deconstruct the JSON database row into a grid row
var structureWorkTicketDataForGrid = function(){
	// Represents all the data in the grid
	var data = [];
	// Holder for each tag as we iterate
	var history = {};
	// Loop thru each tag in the Tag Collection
	var keys = Object.keys(workTicketTracker);

	// RR TODO Mem copy instead of reassigning

	for (var i in keys) {
		// Current row
		var entry = {};

		var id = keys[i];
		
		ticket = workTicketTracker[id];

		entry["Work Ticket ID"] = id;
		entry["Completed"] = ticket["Completed"];
		entry["Date"] = convertMsToSimpleDate(ticket["Start Time"]);
		entry["Total Time (hours)"] = ticket["Total Time (hours)"];
		entry[ISSUE_COMMENTS] = ticket[ISSUE_COMMENTS];
		entry["Inspector"] = ticket["Inspector"];

		entry["Finish Time"] = convertMsToSimpleTime(ticket["Finish Time"]);
		entry["Start Time"] = convertMsToSimpleTime(ticket["Start Time"]);
		entry[ROOT_CAUSE] = ticket[ROOT_CAUSE];
		entry[ACTION] = ticket[ACTION];
		entry[REMARKS] = ticket[REMARKS];
		entry[BREAKDOWNISSUE] = ticket[BREAKDOWNISSUE];
		entry[SHIFT] = ticket[SHIFT];
		entry[MACHINE_STOP_TIME] = ticket[MACHINE_STOP_TIME];

		if( ! entry["Completed"]){
			entry.warn = true;
		}
		else{
			entry.healthy = true;
		}

		data.push(entry);

	}

	return data;
}

// Create map of tags to its most recent action
var createWorkTicketTracker = function(tagHistories){

	for(var i in tagHistories){
		var row = tagHistories[i].data;
		var details = JSON.parse(row.details);
		var id = row.item_id;
		switch(row.event){
			case "Start Repair":
				// RR TODO: Harden code via ensure item does not already exist
				addNewWorkTicket(row);
				break;
			case "End Repair":
				// RR TODO: Harden code via Ensure item exists

				updateWorkTicket(row);
				break;
			// Not a repair item
			default:
				// We don't care about other types of Events
				break;
		}
	}
}

var addNewWorkTicket = function(row){
	var details = JSON.parse(row.details);
	var id = row.item_id.split("-")[1];
	var time = row.time;
	var comments = details[ISSUE_COMMENTS];
	var inspector = row.inspector;
	if(row.event == START_REPAIR){
		workTicketTracker[id] = {};
		workTicketTracker[id]["Start Time"] = time;
		workTicketTracker[id]["Completed"] = false;
		workTicketTracker[id][ISSUE_COMMENTS] = comments;
		workTicketTracker[id][BREAKDOWNISSUE] = details[BREAKDOWNISSUE];
		workTicketTracker[id][SHIFT] = details[SHIFT];
		workTicketTracker[id]["Inspector"] = inspector;
		workTicketTracker[id][MACHINE_STOP_TIME] = details[MACHINE_STOP_TIME];
	}
	else{
		// We ignore any scenarios in which "Finish Repair" occurs before "Start Repair"
	}
}

var updateWorkTicket = function(row){
	var details = JSON.parse(row.details);
	// item id of End Repair item is not used
	// var id = row.item_id;
	var id = details["Work Ticket ID"];
	var time = row.time;
	if(row.event == END_REPAIR && workTicketTracker[id] != null){
		workTicketTracker[id]["Finish Time"] = time;
		workTicketTracker[id]["Completed"] = true;
		// workTicketTracker[id]["Comments"] += (" - Finish: " + comments);
		workTicketTracker[id][ROOT_CAUSE] = details[ROOT_CAUSE];
		workTicketTracker[id][ACTION] = details[ACTION];
		workTicketTracker[id][REMARKS] = details[REMARKS];
		var totalTimeHours = calculateTimeDiffHours(workTicketTracker[id]["Start Time"],workTicketTracker[id]["Finish Time"]);
		workTicketTracker[id]["Total Time (hours)"] = totalTimeHours;
	}
	else{
		// We ignore any scenarios in which "Finish Repair" occurs before "Start Repair"
	}
}

var calculateTimeDiffHours = function(start, finish){
	var diffInMs = finish - start;
	var diffInHours = diffInMs / MS_PER_HOUR;

	var diffInHoursRounded = (Math.round(diffInHours * 10)) / 10;
	return diffInHoursRounded;

}

var convertMsToSimpleDate = function(dateInMs){
	if(dateInMs != null){
		var date = new Date();
		date.setTime(dateInMs);
		var UTC = date.toISOString();
		return UTC.split("T")[0];
	}
	else{
		return "";
	}
}

var convertMsToSimpleTime = function(dateInMs){
	if(dateInMs != null){
		var date = new Date();
		date.setTime(dateInMs);
		var UTC = date.toString();
		return UTC.split(" ")[4];
	}
	else{
		return "";
	}
}

var processWorkTickets = function(tagHistories){
    // Call ActionAlert logic
    createWorkTicketTracker(tagHistories);
    // Set global boolean to true
    tagHistoriesHaveLoaded = true;
    // If both have loaded, then load the data grid
    if(tagHistoriesHaveLoaded && tagsHaveLoaded){
    	updateWorkTicketGrid();
    }
}

//END logic helpers


