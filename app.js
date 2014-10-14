var express = require('express');
var app = express();
var routes = require('./routes');
var path = require('path');
var bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//Routes
// Main App Page
app.get('/', routes.index);
// app.get('/customer/:id', routes.getcustomerById);
app.get('/customers', routes.getCustomer);
app.get('/customers/:cid', routes.getCustomerByCid);
app.post('/customers/:cid', routes.saveCustomer);

app.get('/create', routes.create);

// MongoDB API Routes
// app.get('/polls/polls', routes.list);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
 