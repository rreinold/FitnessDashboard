var DEFAULT_ID_COL_WIDTH = "75px";
var DEFAULT_EMAIL_COL_WIDTH = "200px";
var DEFAULT_SUPPORT_URL_COL_WIDTH = "180px";

var CHECK_IN_DATE = "Check In Date"
var NO_DATA_AVAILABLE_MESSAGE = "No check ins found."

var jsGridConfig =
	{
	    width: "100%",
	    height: "80%",

	    sorting: true,
	    paging: true,
	 	noDataContent: NO_DATA_AVAILABLE_MESSAGE,
	}


function startupMainDashboard() {
	fetchAllBodyMeasurements(structureRowData)
	fetchColumns(buildColumns)
};

// END UI Events


// START logic helpers

// Fill in grid with Tags from the selected schema
var updateGrid = function (){

	// Create jsGrid, load data and fields into it
	$("#tagGrid").jsGrid(jsGridConfig);
	$("#tagGrid").jsGrid("sort", { field: CHECK_IN_DATE, order: "asc" });
	
}


// Deconstruct the JSON schema into individual column fields
var buildColumns = function(rawColumns){
	var columns= [];
	// Start at index 1 to skip item_id
	for(var i = 1 ; i < rawColumns.length ; i++){

		var rawName = rawColumns[i].ColumnName
		var name = snakeCaseToHumanCase(rawName)

		var rawType = rawColumns[i].ColumnType
		var type = sqlTypesToJSGrid[rawType]

		columns.push({name: name, type: type, align:"center"})
	}
	jsGridConfig.fields = columns
	updateGrid()
}

var structureRowData = function(rawRowData){
	var allRows = [];

	for (var i = 0 ; i < rawRowData.length; i++) {
		var row = {};
		var row = rawRowData[i].data;
		var keys = Object.keys(row)

		for(var j in keys){
			var key = keys[j]
			var humanCase = snakeCaseToHumanCase(key)
			row[humanCase] = row[key]
		}
		allRows.push(row)
	}
	jsGridConfig.data = allRows
	updateGrid()
}

//END logic helpers


