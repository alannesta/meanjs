var express = require('express');
var app = express();
var routes = require('./routes');

// Main App Page
app.get('/', routes.index);
// app.get('/customer/:id', routes.getcustomerById);
app.get('/create', routes.create);

// MongoDB API Routes
// app.get('/polls/polls', routes.list);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
 