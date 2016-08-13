function findMinMax(metrics, bodyMeasurements){
	for(i in metrics){
		var metric = metrics[i]

		var MAX_SAFE_NUMBER = 9007199254740991;
     	var min = MAX_SAFE_NUMBER,
        max = -1 * MAX_SAFE_NUMBER;
		for( j in bodyMeasurements){
			var checkIn = bodyMeasurements[j]
			if(checkIn[metric.key] < min){
				min = checkIn[metric.key]
			}
			if(checkIn[metric.key] > max){
				max = checkIn[metric.key]
			}
		}
		metric.min = min
		metric.max = max
	}
}