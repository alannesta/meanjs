app.filter('formatDate', function() {
	return function(date) {
		if (date){
			var momentStr = new moment(date);		//utilize moment.js
			return momentStr.format('YYYY-MM-DD');
		}else{
			return "No Date Selected"
		}
		
	};
});