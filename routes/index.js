var mongoose = require('mongoose');
var CONFIG = require('../config.js');
var db;

db = mongoose.createConnection(CONFIG.dbUrl);

// Get customer schema and model
var CustomerSchema = require('../models/customer.js').CustomerSchema;
var Customer = db.model('customer', CustomerSchema);

exports.index = function(req, res) {
	// Query Mongo for polls, just get back the question text
	Customer.find({name: "mongoose"}, {}, function(error, customer) {
		// res.json(customer);
		// console.log(customer);
		res.render('index', {customer: customer});
	});
};

exports.getCustomer = function(req, res) {
	Customer.find({}, {}, function(error, customer) {
		res.json(customer);
	});
};


exports.create = function(req, res) {
	var reqBody = req.body,
			// Build up poll object to save
			customerObj = {name: "杨小姐", phone: "514-549-3316", weichat: 21431549, date: [{appointment: "2014-10-11", contact: "2014-10-8"}], note: "100天男宝宝，169套餐"};
				
	// Create poll model from built up poll object
	var customer = new Customer(customerObj);
	
	// Save poll to DB
	customer.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.send("create successfully");
			// res.json(doc);
		}		
	});
};