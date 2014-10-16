app.filter('formatDate', function() {
	return function(date) {
		var momentStr = new moment(date);		//utilize moment.js
		return momentStr.format('YYYY-MM-DD');
	};
});