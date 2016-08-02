var checkInSchema = [
		"check_in_timestamp",
		"weight",
		"total_body_water",
		"dry_lean_mass",
		"body_fat_mass",
		"lean_body_mass",
		"skeletal_muscle_mass",
		"bmi",
		"percent_body_fat",
		"right_arm_mass",
		"right_arm_percent",
		"left_arm_mass",
		"left_arm_percent",
		"trunk_mass",
		"trunk_percent",
		"right_leg_mass",
		"right_leg_percent",
		"left_leg_mass",
		"left_leg_percent",
		"body_fat_mass_differential",
		"lean_body_mass_differential",
		"basal_metabolic_rate"
		]

function retrieveBodyMeasurementForm(){
	var bodyMeasurement = {}
	for(var i in checkInSchema){
		var id = "checkin_item_"+i
		var element = document.getElementById(id)
		if(element === undefined){
			continue;
		}
		var entry = element.value;
		var key = checkInSchema[i]
		if(key !== "check_in_date"){
			entry = parseFloat(entry)
		}
		bodyMeasurement[key] = entry;
	}
	// needs callback
	submitBodyMeasurement(bodyMeasurement,function(err, data) {
        if(err || !data.success) {
            alert(data.results)
        } else {
            alert("Submit successful!")
            showView(DEFAULT_POST_LOGIN_VIEW);
        }
    })


}