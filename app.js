var express = require('express');
var app = express();
var routes = require('./routes');
var path = require('path');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//Routes
// Main App Page
app.get('/', routes.index);
// app.get('/customer/:id', routes.getcustomerById);
app.get('/create', routes.create);

// MongoDB API Routes
// app.get('/polls/polls', routes.list);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
 