function startupProgressBars(){
      removeChildren(document.getElementById("progressbar1"))
    var progress = 1
      var graph = document.getElementById("progressbar1")
      var bar = new ProgressBar.SemiCircle(graph, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#2ECC40',
        trailColor: '#eee',
        trailWidth: 1,
        // svgStyle: {{width: '100%', height: '100%'}},
        text: {
          style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#999',
            position: 'absolute',
            right: '0',
            top: '30px',
            padding: 0,
            margin: 0,
            transform: null
          },
          autoStyleContainer: false
        },
        from: {color: '##2ECC40'},
        to: {color: '#ED6A5A'},
        step: (state, bar) => {
          bar.setText((progress * 100) + "%");
        }
      });

      bar.animate(progress);  // Number from 0.0 to 1.0

      removeChildren(document.getElementById("progressbar2"))
      var progress = 1
      var graph = document.getElementById("progressbar2")
      var bar = new ProgressBar.SemiCircle(graph, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#FF851B',
        trailColor: '#eee',
        trailWidth: 1,
        // svgStyle: {width: '100%', height: '100%'},
        text: {
          style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#999',
            position: 'absolute',
            right: '0',
            top: '30px',
            padding: 0,
            margin: 0,
            transform: null
          },
          autoStyleContainer: false
        },
        from: {color: '#FFEA82'},
        to: {color: '#ED6A5A'},
        step: (state, bar) => {
          bar.setText((progress * 100) + "%");
        }
      });

      bar.animate(progress);  // Number from 0.0 to 1.0

      
}