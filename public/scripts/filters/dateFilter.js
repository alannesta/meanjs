app.filter('formatDate', function() {
	return function(date) {
		// var dateObj = new Date(date);
		// // console.log(dateObj.toLocaleString());
		// var dateStr = dateObj.toLocaleString();

		// var cutIndex = dateStr.indexOf(' ');
		// return dateStr.substring(0, cutIndex);
		var momentStr = new moment(date);		//utilize moment.js
		return momentStr.format('YYYY-MM-DD');

	};
});