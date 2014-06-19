var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var nedb = require('nedb');
var path = require('path');

// initialise the db
app.db = {};
app.db.users = new nedb({ filename: path.join(__dirname, '/dbs/users.db'), autoload: true });

// setup the app
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('root', __dirname);
app.engine('html', require('swig').renderFile);
app.use(bodyParser());

// add the routes
require('./router.js')(app);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port %d', server.address().port);
});
