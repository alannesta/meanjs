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

exports.getCustomerByCid = function(req, res) {
	// console.log(req.params.phone);
	Customer.find({cid: req.params.cid}, {}, function(error, customer) {
		res.json(customer);
	});
};

exports.deleteCustomer = function(req, res) {
	// console.log("called");
	var cid = req.params.cid
	Customer.remove({cid: req.params.cid}, function(error, status) {
		if (error){
			res.send(error);
		}else{
			res.status(200).send("Delete Success, id: " + cid);
		}
	});
};


exports.saveCustomer = function(req, res) {
	var reqbody = req.body;
	// console.log(reqbody);
	// customerObj = {id: 1, name: reqbody.name, phone: reqbody.phone, weichat: reqbody.weichat, date: [{appointment: "2014-10-11", contact: "2014-10-8"}], note: reqbody.note};
	// var customer = new Customer(customerObj);

	// Save updates to DB
	Customer.findOneAndUpdate({cid: reqbody.cid}, {name: reqbody.name, phone: reqbody.phone, weichat: reqbody.weichat, appointment: reqbody.appointment, note: reqbody.note}, {upsert: true}, function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.send("update successfully");
			// res.json(doc);
		}		
	});
};

//create test data to bootstrap
exports.create = function(req, res) {
	var reqBody = req.body,
	
	// Build up poll object to save
	customerObj = {cid: 1, name: "杨小姐", phone: "514-549-3316", weichat: 21431549, appointment: "2014-10-11", note: "100天男宝宝，169套餐"};
	console.log(req.body);	

	//TODO: get last id in the db

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