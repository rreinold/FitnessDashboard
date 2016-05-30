var DEFAULT_ID_COL_WIDTH = "75px";
var DEFAULT_EMAIL_COL_WIDTH = "200px";
var DEFAULT_SUPPORT_URL_COL_WIDTH = "180px";

var CHECK_IN_DATE = "Check In Date"
var WEIGHT = "Weight"
var CHECKED_IN = "Checked In"
function startupMainDashboard() {
	fetchWeightGoal();
	fetchAllCheckInData(updateGrid)
};


// END UI Events


// START logic helpers

// Fill in grid with Tags from the selected schema
var updateGrid = function (){

	// Create jsGrid, load data and fields into it
	$("#tagGrid").jsGrid({
	    width: "100%",
	    height: "80%",

	    sorting: true,
	    paging: true,
	 	noDataContent: "No check ins found.",

	    data: structureData(allCheckIns),
	 	fields: buildFields()
	    
	});
	$("#tagGrid").jsGrid("sort", { field: CHECK_IN_DATE, order: "asc" });
	
	
}


// Deconstruct the JSON schema into individual column fields
var buildFields = function(schema){
	var fields= [];
    fields.push({ name: "Check In Date", type: "text", width:DEFAULT_ID_COL_WIDTH, align: "center"});
    fields.push({ name: "Checked In", type: "checkbox", width:"20px", align: "center"});
    fields.push({ name: "Weight", type: "number", width:DEFAULT_ID_COL_WIDTH, align: "center"});
	return fields;
}

// Deconstruct the JSON database row into a grid row
var structureData = function(schema){
	// Represents all the data in the grid
	var data = [];
	// Holder for each tag as we iterate

	// Loop thru each tag in the Tag Collection
	for (var i = 0 ; i <allCheckIns.length; i++) {
		// Current row
		var entry = {};
		
		var row = allCheckIns[i].data;
		// If the tag belongs to the selected schema..
		entry[CHECK_IN_DATE]=row["checkindate"];
		entry[WEIGHT] = row["measuredweightlbs"] == 0 ? null : row["measuredweightlbs"]
		entry[CHECKED_IN] = row["measured"]

		data.push(entry)
	}
	return data;
}

//END logic helpers


