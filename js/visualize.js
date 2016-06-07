function startupVisualize(){
	// TODO minimize duplicate API CAll
	fetchAllBodyMeasurements(graph)

}
function retrieveMetric(key){
	var graphData = []
    for (var i = 0; i < bodyMeasurements.length; i++) {
        var goodStuff = bodyMeasurements[i].data
    	var entry = {
    	    "date": goodStuff.check_in_date,
    	    "value": goodStuff[key]
    	}
    	graphData.push(entry)
    }
    return MG.convert.date(graphData, 'date');
}

function graph() {
	
	mountHeaderData()


	var metrics = [
	{"key":"weight","color": '#8C001A'},
	{"key":"skeletal_muscle_mass","color": '#FF851B'},
	{"key":"dry_lean_mass","color": '#001f3f'},
	{"key":"percent_body_fat","color": '#FFDC00'},
	{"key":"dry_lean_mass","color": '#2ECC40'},
	{"key":"left_arm_mass","color": '#7FDBFF'},
	{"key":"bmi","color": '#FF4136'},
	{"key":"basal_metabolic_rate","color":"#B10DC9"}
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
        var goodStuff = bodyMeasurements[i].data
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
        var normalized = (rawValue - min) / range
    	var entry = {
    	    "date": goodStuff.check_in_date,
    	    "value": normalized
    	}
    	graphData.push(entry)
    }
    return MG.convert.date(graphData, 'date');
}
	var metrics = [
		{"key":"weight","color": '#8C001A'},
		{"key":"skeletal_muscle_mass","color": '#FF851B'},
		{"key":"percent_body_fat","color": '#FF851B'}
	]
	for(i in metrics){
		data.push(normalizeMetric(metrics[i].key))
	}
	
	 var markers = [
	 {
        'date': new Date('2015-10-02T00:00:00.000Z'),
        'label': 'Emphasis on Cardio'
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

	var legend = []
	for(i in metrics){
		legend.push(snakeCaseToHumanCase(metrics[i].key))
	}


	MG.data_graphic({
        title: "Key Metrics",
        description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
		data: [data[0], data[1], data[2]],
        width: 1200,
        interpolate: 'basic',
        animate_on_load: true,
        min_y_from_data: true,
        height: 300,
        right: 40,
        target: "#graphX",
        legend: legend,
        legend_target: '.legend',
        x_accessor: 'date',
        markers: markers,
        y_accessor: 'value',
        baselines: [{value: 0.5, label: 'Day 1'}],
        colors: ['blue', 'rgb(255,100,43)', '#CCCCFF'],
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


	var data = retrieveMetric(metric.key)
	var graphName = "#graph" + graphID
	// createGraphElement("graph" + graphID)
    MG.data_graphic({
        title: snakeCaseToHumanCase(metric.key),
        description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
        data: data,
        width: 600,
        interpolate: 'basic',
        animate_on_load: true,
        min_y_from_data: true,
        color: metric.color,
        height: 200,
        right: 40,
        markers: markers,
        target: graphName,
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