// Maps each unique tag to its most recent action
var tagToMostRecentActionMap = {};

// Schema key and default value for due now
var actionDueConstants = {
	SCHEMA_KEY: "Action Frequency (days)",
	DUE_NOW: 0,
};

// Milliseconds in one day, used for calculations
var MS_PER_DAY = 86400000;

// Get number of days until next action is required.
// If no previous action is found, then due date is set to 0 days
var getActionDueValue = function(tag){
		// Has this ever been inspected?
		if(tagToMostRecentActionMap[tag.tagid] == null){
			// Due in 0 days, meaning it is due now!
			return actionDueConstants.DUE_NOW;
		}
		else{
			// Determine number of days since last action
			var alertRules = JSON.parse(tag.alertrules);
			// Get current time
			var now = new Date();
			nowInUnix = now.getTime();
			// Get date of last action
			var time = new Date();
			var timeOfPastActionInUnix = time.setTime(tagToMostRecentActionMap[tag.tagid]);
			var frequencyInDays = alertRules[actionDueConstants.SCHEMA_KEY];
			var dueDateInMs = calculateDueDate(timeOfPastActionInUnix, frequencyInDays);
			// Get number of days since action due date
			var daysBetweenDueDateAndNow = calculateDaysBetweenDates(nowInUnix, dueDateInMs);
			// Return number of days between last
			return daysBetweenDueDateAndNow;
		}
}

var convertMsToDateString = function(dateInMs){
	if(dateInMs != null){
		var date = new Date();
		date.setTime(dateInMs);
		return date;
	}
	else{
		return "";
	}
}

// Create map of tags to its most recent action
var createMapOfKeysToActionDue = function(tagHistories){
	var tag = {};
	for(var i in tagHistories){
		var timeStamp = tagHistories[i].data.time
		var date = new Date();
		date.setTime(timeStamp);
		tag = tagHistories[i].data.tagid;
		if(tagToMostRecentActionMap[tag] == null){
			tagToMostRecentActionMap[tag] = timeStamp;
		}
		else{
			// It is in descending order, so any entries that occured previous
			// to the recorded action is irrelevant
		}
	}
}

// Determine when the next action is required
var calculateDueDate = function(pastActionTimeInMs, frequencyInDays){
	return pastActionTimeInMs + (frequencyInDays * MS_PER_DAY);
}

// Calculate the number of days since an action's due date
var calculateDaysBetweenDates = function(nowInMs, dueDateInUnix){
	var diffInMs = dueDateInUnix - nowInMs;
	var diffInDays = diffInMs / MS_PER_DAY;
	return Math.floor(diffInDays);
}

// Determine if this schema requires an "Action Due" field
var hasAlerts = function(schema){
	return (schema.hasalerts);
}
