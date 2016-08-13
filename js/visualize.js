var enableBaseline = false;


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
            "date": goodStuff.check_in_timestamp.split('T')[0],
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

    function normalizeMetric(metric){
    var graphData = []
    var key = metric.key
    for (var i = 0; i < bodyMeasurements.length; i++) {
        var goodStuff = bodyMeasurements[i]
        var rawValue = goodStuff[key] 
        var range = metric.max - metric.min
        switch(key){
        }
        var normalized = (enableBaseline && i == 0) ? 1.0 : ((rawValue - metric.min) / range) * 2 + 1
        var entry = {
            "date": goodStuff.check_in_timestamp.split('T')[0],
            "value": normalized,
            "metric":key,
            "min":metric.min,
            "range":range
        }
        graphData.push(entry)
    }
    return MG.convert.date(graphData, 'date');
}
    
    findMinMax(metrics, bodyMeasurements)

    for(i in metrics){
        data.push(normalizeMetric(metrics[i]))
    }
    // Set first datapoint to 1.0 as starter point
    if(data.length > 1){
        data[0].value = 1.0
    }
    
     

    var legend = []
    for(i in metrics){
        legend.push(snakeCaseToHumanCase(metrics[i].key))
    }

    MG.data_graphic({
        //title: "Key Metrics",
        data: [data[0], data[1]],
        inflator:(12/10),
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
        markers: markers,
        y_accessor: 'value',
        y_axis:false,
        mouseover: function(d, i) {

        var textContainer = d3.select('#aggregate svg .mg-active-datapoint');

            textContainer.selectAll("*").remove();



        //custom format the rollover text, show days
        var prefix = d3.formatPrefix(d.value);
        var mouseoverElement = document.getElementById('div#custom-mouseover');
        var mouseoverEntry;
        for(i in d.values){
            var datapoint = d.values[i]
             if(datapoint.date == d.key){
                mouseoverEntry = datapoint
                break;
             }
        }
        var unscaledValue = (((datapoint.value - 1) / 2) * datapoint.range) + datapoint.min//((rawValue - metric.min) / range) * 2 + 1
        mouseoverElement.innerHTML = ('Rob ' + datapoint.date + ' &nbsp; '
                + unscaledValue + prefix.symbol);
        },
        //baselines: [{value: 1.0, label: 'Initial'}],
        colors: ['blue', 'rgb(255,100,43)'],
        aggregate_rollover: true
    });
    
}

function mountData(graphID, metric){

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
        // markers: markers,
        target: graphName,
        full_width:true,
        x_accessor: 'date',
        y_accessor: 'value'
    });
}
