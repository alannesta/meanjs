var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/mydb');

exports.CustomerSchema = new mongoose.Schema({
	id: {type: Number, required: true},
	name: { type: String, required: true },
	phone: String,
	weichat: String,
	date: [{appointment: Date, contact: Date}],
	note: {type: String}
});