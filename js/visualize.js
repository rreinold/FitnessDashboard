function startupVisualize(){
    if(!initialized){
        Q.all([fetchBodyMeasurementRange("3MO",graph),fetchColumns(buildColumns)])
                .then(function(){
                    startupProgressBars()
                })
                .catch(function (error) {
                    console.log(error)
                })
                .done();
    }
}
function retrieveMetric(key, percentage){
	var graphData = []
    if(bodyMeasurements.length <= 0){
        return
    }
    var initial = bodyMeasurements[0]
    for (var i = 0; i < bodyMeasurements.length; i++) {
        var goodStuff = bodyMeasurements[i]

        if(percentage){
            var rawValue = goodStuff[key]
            var initialValue = initial[key]
            var value = rawValue / initialValue
        }
        else{
            var value = goodStuff[key]
        }

    	var entry = {
    	    "date": goodStuff.check_in_date,
    	    "value": value
    	}
    	graphData.push(entry)
    }
    return MG.convert.date(graphData, 'date');
}

function graph() {

    if(bodyMeasurements.length == 0){
        alert("No checkins founds. Please go to \"Check In\" and add your Body Measurement.")
    }
	
	mountHeaderData()


	var metrics = [
	{"key":"weight","color": '#8C001A','percentage':false},
    {"key":"basal_metabolic_rate","color":"#001f3f",'percentage':false},
    {"key":"dry_lean_mass","color": '#001f3f','percentage':false},
    {"key":"bmi","color": '#FF4136'},
    {"key":"skeletal_muscle_mass","color": '#FF851B',"width":"full",'percentage':false},
    {"key":"percent_body_fat","color": '#FFDC00',"width":"full"},

	{"key":"left_arm_mass","color": '#8C001A','percentage':false},
    {"key":"right_arm_mass","color":"#8C001A",'percentage':false},
    {"key":"left_leg_mass","color":"#FF851B",'percentage':false},
    {"key":"right_leg_mass","color":"#001f3f",'percentages':false},
    {"key":"trunk_mass","color":"#7FDBFF", "width":"full",'percentage':false}

	]

	for(i in metrics){
		mountData(i, metrics[i])
	}
	
}

function mountHeaderData(){
	// Master data!
	var data = []

	function normalizeMetric(key){
	var graphData = []

    for (var i = 0; i < bodyMeasurements.length; i++) {
        var goodStuff = bodyMeasurements[i]
        var rawValue = goodStuff[key] 
        var min = 0
        var range = 1
        switch(key){
        	// 160 to 180, range is 20
        	case "weight":
	        	min = 160
	        	range = 15
	        	break;
        	// 21 to 11, range is 10
        	case "percent_body_fat":
	        	min = .11
	        	range = .10
	        	break;
        	// 76 to 86, range is 10
        	case "skeletal_muscle_mass":
	        	var min = 76
	        	var range = 10
	        	break;
        }
        var normalized = i == 0 ? 1.0 : ((rawValue - min) / range)*2
    	var entry = {
    	    "date": goodStuff.check_in_date,
    	    "value": normalized
    	}
    	graphData.push(entry)
    }
    return MG.convert.date(graphData, 'date');
}
	var metrics = [
		{"key":"skeletal_muscle_mass","color": '#FF851B'},
		{"key":"percent_body_fat","color": '#FF851B'}
	]
	for(i in metrics){
		data.push(normalizeMetric(metrics[i].key))
	}
    // Set first datapoint to 1.0 as starter point
    if(data.length > 1){
        data[0].value = 1.0
    }
	
	 var markers = [
	 {
        'date': new Date('2015-10-02T00:00:00.000Z'),
        'label': 'Emphasis on Cardio',
        'affects':'all'
    },
	 {
        'date': new Date('2015-11-18T00:00:00.000Z'),
        'label': 'Home, No Gym'
    },
    {
        'date': new Date('2015-11-25T00:00:00.000Z'),
        'label': 'Seeing Kayla'
    },
    {
        'date': new Date('2015-12-22T00:00:00.000Z'),
        'label': 'Home, No Gym'
    },
    {
        'date': new Date('2015-12-31T00:00:00.000Z'),
        'label': 'New Years Eve Party Destroys Body'
    },
    {
        'date': new Date('2016-04-19T00:00:00.000Z'),
        'label': 'Body Challenge, Up the Protein'
    },
    {
        'date': new Date('2016-04-24T00:00:00.000Z'),
        'label': 'Began Carb Supplement'
    },
	 {
        'date': new Date('2016-02-22T00:00:00.000Z'),
        'label': 'New Strength Training Routine'
    }, {
        'date': new Date('2016-02-02T00:00:00.000Z'),
        'label': 'Cut Down Gym Time = Lost Muscle'
    }];

    var minimalMarkers = [

{
    'date':new Date('2015-09-06T00:00:00.000Z'),
    'label':'Begin Cut'
},
{
    'date':new Date('2016-01-24T00:00:00.000Z'),
    'label':''
},
{
    'date':new Date('2016-01-24T00:00:00.000Z'),
    'label':'New Job'
},
{
    'date':new Date('2016-02-22T00:00:00.000Z'),
    'label':''
},
{
    'date':new Date('2016-02-22T00:00:00.000Z'),
    'label':'Bulk'
}
    ]

	var legend = []
	for(i in metrics){
		legend.push(snakeCaseToHumanCase(metrics[i].key))
	}

	MG.data_graphic({
        title: "Key Metrics",
		data: [data[0], data[1]],
        width: 700,
        // interpolate: 'basic',
        interpolate_tension:0.92,
        animate_on_load: true,
        // min_y_from_data: true,
        height: 300,
        right: 40,
        target: "#graphX",
        legend: legend,
        legend_target: '.legend',
        x_accessor: 'date',
        full_width:true,
        linked:true,
        markers: minimalMarkers,
        y_accessor: 'value',
        baselines: [{value: 1.0, label: 'Initial'}],
        colors: ['blue', 'rgb(255,100,43)'],
        aggregate_rollover: true
    });
    
}

function mountData(graphID, metric){

	var markers = [
	 {
        'date': new Date('2015-10-02T00:00:00.000Z'),
        'label': 'Emphasis on Cardio'
    },
    {
        'date': new Date('2016-04-24T00:00:00.000Z'),
        'label': 'Carb Supplement'
    },
	 {
        'date': new Date('2016-02-22T00:00:00.000Z'),
        'label': 'New Strength Routine'
    }];


	var data = retrieveMetric(metric.key, metric.percentage)
	var graphName = "#graph" + graphID
	// createGraphElement("graph" + graphID)
    var width = 600
    if(metric.width){
        width*=2
    }
    MG.data_graphic({
        title: snakeCaseToHumanCase(metric.key),
        data: data,
        width: width,
        linked:true,
        interpolate_tension:0.92,
        animate_on_load: true,
        min_y_from_data: true,
        color: metric.color,
        height: 200,
        right: 40,
        markers: markers,
        target: graphName,
        full_width:true,
        x_accessor: 'date',
        y_accessor: 'value'
    });
}

// function createGraphElement(graphName){
// 	var graphs = document.getElementById("graphs")
// 	var graph = document.createElement("div")
// 	graph.setAttribute("id",graphName);
// 	graphs.appendChild(graph)
// }