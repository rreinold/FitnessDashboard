function startupGoals(){

	var goals = [
	{"name":"Pullups"},
	{"name":"Pushups"},
	{"name":"Muscleups"},
	{"name":"Squat"},
	{"name":"Bench"},
	{"name":"Deadlift"},
	{"name":"Vertical"}
	]

	for (i in goals){
		graphGoal(i, goals[i].name)
	}

	function graphGoal(id, name){

		var elementId = "goal"+id
	  	removeChildren(document.getElementById(elementId))

		  var graph = document.getElementById(elementId)
		  var random = Math.random()
		  var percent = Math.round(random*100)
		  var label = percent+ " %"
		  var bar = new ProgressBar.Line(graph, {
		    strokeWidth: 4,
		    easing: 'easeInOut',
		    duration: 1400,
		    color: '#39CCCC',
		    trailColor: '#eee',
		    trailWidth: 1,
		    svgStyle: {width: '100%', height: '10%'},
		    text: {
		      style: {
		        // Text color.
		        // Default: same as stroke color (options.color)
		        color: '#999',
		        position: 'absolute',
		        right: '0',
		        top: '50px',
		        padding: 0,
		        margin: 0,
		        transform: null
		      },
		      autoStyleContainer: false
		    },
		    from: {color: '#FFEA82'},
		    to: {color: '#ED6A5A'},
		    step: (state, bar) => {
		      bar.setText(label);
		    }
		  });

	  	bar.animate(random);  // Number from 0.0 to 1.0
	}
}