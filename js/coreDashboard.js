var bodyMeasurements = null;
var dueDate = null
var allCheckIns = null

var sqlTypesToJSGrid={
    "float"	    : "number",
    "double"	: "number",
    "int"	    : "number",
    "bigInt"	: "number",
    "uuid"	    : "number",
    "blob"	    : "number",
    "string"    : "text",
    "timestamp"	: "text",
    "boolean"	: "checkbox"
}

var cb = new ClearBlade();
var initOptions = {
    URI : "https://platform.clearblade.com",
    messagingURI : "platform.clearblade.com",
    messagingPort: 8904,
    useMQTT: true,
    cleanSession: true,
    systemKey: "9898daf40ad28aa9f885dfa5dc38",
    systemSecret: "9898DAF40A94CAC891A7D5C78749",
};

function fetchWeightGoal(){
    var query = ClearBlade.prototype.Query({"collectionName":"FinalGoals"})
    query.equalTo("targetname","Weight")
    query.setPage(0, 0);
    query.fetch(function(err, data){
        if (err){
           alert(JSON.stringify(data));
        }else{
            // Store API response locally
            targetWeight = data[0].data.targetvalue;
            dueDate = data[0].data.duedate;
        }
    })
}

function fetchAllBodyMeasurements(callback){
        var query = ClearBlade.prototype.Query({"collectionName":"BodyMeasurements"})
        query.setPage(0, 0);
        query.ascending("check_in_date")
        query.fetch(function(err, data){
            if (err){
               
            }else{
                bodyMeasurements = data
                callback(data)
            }
        })
}

function fetchColumns(callback){
    var collection = ClearBlade.prototype.Collection({"collectionID":"ba98daf40adea9d3a7a0c4c1cb62"})
    collection.columns(function(err, data){
        if(err){
            alert(JSON.stringify(data));
        }
        else{
            callback(data)
        }
    })
}

// TODO Confirm patch
// function fetchColumns(callback){
//     var collection = ClearBlade.prototype.Collection({"collectionName":"BodyMeasurements"})
//     collection.columns(function(err, data){
//         if(err){
//             alert(JSON.stringify(data));
//         }
//         else{
//             callback(data)
//         }
//     })
// }



// Request schemas for the Tag collection
var isCoordinator = function(successCallback, failureCallback) {

    successCallback();

    // cb.Code().execute("isCoordinator", {}, function(err, data) {
    //     if(err) {
    //         failureCallback();
    //     } else {
    //         successCallback();
    //     }
    // });
};

//START API call functions

var startup = function(){

    var initCallback = function(err, data){
        if(err) {
            // this path should not happen and would only happen with a misconfigured system or server outage
            alert("failed to init");
        } else {
            // initButtons()
            var authCallback = function(){
                showView(DEFAULT_POST_LOGIN_VIEW);
                startupMainDashboard();
                // Start up any additional pages
            };

            var noAuthCallback = function(){
                // blockUI not yet implemented
                // blockUI(false, "You are not authorized to access this dashboard.");
                showView("login");
            }

            checkAuth(authCallback, noAuthCallback)
                
            }
    };
    initOptions.callback = initCallback;
    
    cb.init(initOptions);
}

// Sort the js grid by a field
var sortByField = function(gridName, field){
        $(gridName).jsGrid("sort", { field: field, order: "asc" });
}