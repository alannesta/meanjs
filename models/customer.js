var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/mydb');

exports.CustomerSchema = new mongoose.Schema({
	cid: {type: Number,required: true},
	name: { type: String, required: true },
	phone: String,
	weichat: String,
	appointment: Date,
	note: {type: String}
});