var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/mydb');

exports.CustomerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	dob: {type: String}
});