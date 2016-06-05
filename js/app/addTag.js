var objectSchema;
var addTagJsonObject = {};
var idArray = [];

/*
 * This removes all children of a div. The element parameter is the ID of the div
 */ 
var removeChildren = function(element) {
	var objectDropdown = document.getElementById(element);
	var length = objectDropdown.children.length;

	for(var i = length - 1; i >= 0; i--) {
		objectDropdown.removeChild(objectDropdown.children[i]);
	}
}

/*
 * Creates HTML elements like input boxes, select-option elements etc
 */
var generateHtmlElement = function(parentDiv, jsonObject) {
	// var parentDiv = document.getElementById('addTag-2');

	if(jsonObject.type === "string") {
		var input = document.createElement('input');
		input.setAttribute("id", "add_"+jsonObject.name);
		input.setAttribute("class", "fullInput");
		input.setAttribute("placeholder", jsonObject.name);
		input.setAttribute("type", "text");

		//idArray.push(jsonObject.name);

		parentDiv.appendChild(input);
	} else if(jsonObject.type === "combo") {
		var label = document.createElement('p');
		label.innerHTML = jsonObject.name;
		label.className = "addLabel";
		parentDiv.appendChild(label);

		var select = document.createElement('select');
		select.setAttribute("id", "add_"+jsonObject.name)
		select.setAttribute("class", "fullInput");

		for(var j = 0; j < jsonObject.options.length; j ++) {
			var opt = document.createElement('option');
			opt.innerHTML = jsonObject.options[j];
			opt.value = jsonObject.options[j];
			select.appendChild(opt);
		}

		//idArray.push(jsonObject.name);

		parentDiv.appendChild(select);
	}
}

/*
 * This gets the object types based on the selected object category and creates a select-option structure for the types
 */
var getObjectTypes = function(selectedCategory, i) {
	removeChildren('object');

	var objectArray = selectedCategory[document.getElementById('objectCategory').value][i].options;
	var objectDropdown = document.getElementById('object');

	for(var i = 0; i < objectArray.length; i++) {
		var opt = document.createElement('option');
		opt.innerHTML = objectArray[i];
		opt.value = objectArray[i];
		objectDropdown.appendChild(opt);
	}

	document.getElementById('object').style.visibility = "visible";
	document.getElementById('object-type').style.visibility = "visible";
}


var createFormSection = function(sectionSchema, sectionDivId, sectionLabel) {
	removeChildren(sectionDivId);
	var sectionSchemaDiv = document.getElementById(sectionDivId);
	if (sectionSchema!=null) {
		var label = document.createElement('p');
		label.innerHTML = sectionLabel;
		label.className = "headerLabel";
		sectionSchemaDiv.appendChild(label);
		sectionSchema = JSON.parse(sectionSchema);
		for (var i =0; i< sectionSchema.length; i++){
			generateHtmlElement(sectionSchemaDiv, sectionSchema[i] );
		}
	}

}
/*
 * This generates HTML elements based on the selected object category
 */
var getFormObjects = function() {
	//removeChildren('addTag-2');
	addTagJsonObject = {};
	idArray = []; // Array to hold IDs of all form elements. This is used when taking out values from all the form fields
	var selectedObjectCategory;
	var selectedCategoryValue = document.getElementById('objectCategory').value;
	
	var selectedCategoryIndex  = document.getElementById('objectCategory').selectedIndex
	
	createFormSection(objectSchema[selectedCategoryIndex].contactschema, "contactSchemaDiv", "Contact");
	createFormSection(objectSchema[selectedCategoryIndex].detailsschema, "detailsSchemaDiv", "Details");
	createFormSection(objectSchema[selectedCategoryIndex].alertschema, "alertsSchemaDiv", "Alerts");
	
	// RR Remove actions div
	// createFormSection(objectSchema[selectedCategoryIndex].actions, "actionSchemaDiv", "Actions");

}

/*
 * This gets the object schema from the backend and dynamically creates a form to add tag details 
 * depending on the object category selected
 */
var populateAddTagFields = function() {
	cb.Code().execute("GetObjectSchema", {}, function(err, data) {
		if(err) {
			//blockUI(true, data);
			logoutEvent();
			postLoginView = "addTag";
			showView("login");
		} else {
			var response = data.results;

			if(!response.error) { 
				removeChildren('objectCategory');
				objectSchema = response.result;

				//build category dropdown
				for(var j = 0; j < response.result.length; j++) {
					var tagType = response.result[j].type;
					
					var objectCategory = document.getElementById('objectCategory');

					var opt = document.createElement('option');
					opt.innerHTML = tagType;
					opt.value = tagType;
					objectCategory.appendChild(opt);
					
				}
				//show schema for selected category
				getFormObjects();
			} else { // Code service thorws error, logout and go back to login page
				blockUI(true, response.result);
				logoutEvent();
				showView("login");
			}
		}
	});
}

var getAddTagValues = function(sectionSchema){
	var ret = {};
	if (sectionSchema == null){
		return ret;
	}
	sectionSchema = JSON.parse(sectionSchema);
	for (var i =0; i< sectionSchema.length; i++){
		if(sectionSchema[i].name != "Actions"){
			var inpt = document.getElementById("add_"+sectionSchema[i].name);
			ret[sectionSchema[i].name] = inpt.value;
		}
	}
	return ret;
		
};

var createNewTagObject = function(currentSchema) {
	var tag ={};
	
	tag.details = getAddTagValues(currentSchema.detailsschema);
	tag.contact = getAddTagValues(currentSchema.contactschema);
	tag.alerts = getAddTagValues(currentSchema.alertschema);
	// RR We removed actions from tag entry
	//tag.actions = getAddTagValues(currentSchema.actions);
	return tag;
}
/*
 * This executes when the 'Add Tag' button is pressed. It creates a json object to be passed as a param to the "Add Tag" code
 * service and executes the code service. If execution is successful, it goes to the history page
 */
var addTagEvent = function() {
	var serviceParam = {}; // Input param to code service
	var allFieldsPresent = true; // Flag to check if all the form fields are filled by the user
	// for(var i = 0; i < idArray.length; i++) {
	// 	if(document.getElementById(idArray[i].name.toLowerCase()).value !== "") { // Check if a field is not empty
	// 		serviceParam.type = "blah";
	// 		if ( typeof serviceParam[idArray[i].section] === 'undefined'){
	// 			serviceParam[idArray[i].section] = {};
	// 		}
	// 		serviceParam[idArray[i].section][idArray[i].name] = document.getElementById(idArray[i].name.toLowerCase()).value; // Fill the serviceParam object with values from the form fields
	// 	} else {
	// 		allFieldsPresent = false; // A field is empty
	// 		break;
	// 	}
	// }
	var selectedCategoryIndex  = document.getElementById('objectCategory').selectedIndex
	
	var currentSchema = objectSchema[selectedCategoryIndex];
	tagObject = createNewTagObject(currentSchema);
	
	// var objectType = document.getElementById('object').value;
	// serviceParam["Object Type"] = objectType; // Set the object type in the json object

	// if(!allFieldsPresent) { // If all fields re not filled, throw error
	// 	showError("addTag", "All fields are required");
	// } else {
	cb.Code().execute("AddTag", {tagID: tagID, tagSchema: currentSchema.type, tagObject: tagObject}, function(err, data) {
		if(data === "Request Failed: Status 401 Unauthorized\nmessage:Not Authorized\n") {
			blockUI(true, "It looks like you are logged in as an Inspector. You are not authorized to add a new Tag. You must be logged in as a Coordinator.");
		} else {
			var response = data.results;

			if(!response.error) {

				blockUI(true,"Successfully added tag.");
				emptyDiv(document.getElementById("addTag")).className = "hidden";
			} else {
				showError("addTag", response.data);
			}
		}
	});
}