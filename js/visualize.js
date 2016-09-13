var enableBaseline = false;

var keyMetrics = [
{"key":"skeletal_muscle_mass","color": 'blue'},
{"key":"percent_body_fat","color": '#FF851B'}
]
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
        var normalized = (enableBaseline && i == 0) ? 1.0 : ((rawValue - metric.min) / range) * 2 + 1
        var entry = {
            "date": goodStuff.check_in_timestamp.split('T')[0],
            "value": normalized,
            "metric":key,
            "min":metric.min,
            "range":range,
            "color":metric.color
        }
        graphData.push(entry)
    }
    return MG.convert.date(graphData, 'date');
}
    
    findMinMax(keyMetrics, bodyMeasurements)

    for(i in keyMetrics){
        data.push(normalizeMetric(keyMetrics[i]))
    }
    // Set first datapoint to 1.0 as starter point
    if(data.length > 1){
        data[0].value = 1.0
    }
    
     

    var legend = []
    for(i in keyMetrics){
        legend.push(snakeCaseToHumanCase(keyMetrics[i].key))
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

        var textContainer = d3.select('.mg-active-datapoint-container');

            textContainer.selectAll("*").remove();
            var date = d.key.toDateString()
// "<text class="mg-active-datapoint" xml:space="preserve" text-anchor="end" transform="translate(662.375,36.400000000000006)"><tspan x="0" y="0em"><tspan>Jun 16, 2016 </tspan></tspan>
// <tspan x="0" y="1.1em"><tspan font-weight="bold" fill="blue">Skeletal Muscle Mass </tspan><tspan fill="blue">— </tspan><tspan>2.6 </tspan></tspan>
// <tspan x="0" y="2.2em"><tspan font-weight="bold" fill="rgb(255,100,43)">Percent Body Fat </tspan><tspan fill="rgb(255,100,43)">— </tspan><tspan>1.63 </tspan></tspan></text>"
var mouseoverHTML = "";
var dateSpan = "<text class=\"mg-active-datapoint\" xml:space=\"preserve\" text-anchor=\"end\" transform=\"translate(662.375,36.400000000000006)\"><tspan x=\"0\" y=\"0em\"><tspan>" + date + " <\/tspan><\/tspan>";
mouseoverHTML = dateSpan;

    for(i in d.values){
            var datapoint = d.values[i]
            var yPosition = (1.1 + (1.1 * i )) + "em";
            var metric = snakeCaseToHumanCase(datapoint.metric)
            var rawValue = (((datapoint.value - 1) / 2) * datapoint.range) + datapoint.min//((rawValue - metric.min) / range) * 2 + 1
            var row = "<tspan x=\"0\" y=\"" + yPosition + "\"><tspan font-weight=\"bold\" fill=\"" + datapoint.color + "\"> " + metric + " <\/tspan><tspan fill=\"blue\">-  <\/tspan><tspan>" + rawValue + " <\/tspan><\/tspan>"
            mouseoverHTML += row;
        }

        mouseoverHTML += "</text>"
    textContainer[0][0].innerHTML = mouseoverHTML;

        },
        //baselines: [{value: 1.0, label: 'Initial'}],
        colors: [keyMetrics[0].color, keyMetrics[1].color],
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
