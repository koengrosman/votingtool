var express = require('express');
var app = express();
var sassMiddleware = require('node-sass-middleware');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var srcPath = __dirname + '/sass/';
var destPath = __dirname + '/public/styles';
var path = require('path');
var serveStatic = require('serve-static')

//middleware for using bodyparser
app.use(bodyParser.urlencoded({
	extended: true
}));

//middleware for using sequalize
var sequelize = new Sequelize('feedbackapp', 'Koen', null, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

//this defines the new table newidea in sequalize
var idea = sequelize.define('idea', {
	title: Sequelize.STRING,
	description: Sequelize.TEXT,
	email: Sequelize.STRING
});

//middleware for using serve static
app.use('/',
  serveStatic('./public', {})
);

//middleware for creating css files from cass files
app.use('/styles', sassMiddleware({
  src: srcPath,
  dest: path.join(__dirname, 'public/styles'),
  debug: true,
  outputStyle: 'expanded'
}));

//set the default view engine
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/postfeature', function (req, res) {
  res.render('postfeature');
});

app.post('/createidea', function (req, res) {
  res.render('postfeature');
});

app.get('/koen', function (req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
