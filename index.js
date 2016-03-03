var express = require('express');
var app = express();
var sassMiddleware = require('node-sass-middleware');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var pg = require('pg');
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

//this defines the new table newidea in sequalize
var Idea = sequelize.define('idea', {
	title: Sequelize.STRING,
	categories: Sequelize.STRING,
	description: Sequelize.TEXT,
	email: Sequelize.STRING
});

//set the default view engine
app.set('view engine', 'jade');

app.get('/allideas', function (req, res) {
	Idea.findAll().then(function(posts) {
		var data = posts.map(function(post) {
			return {
				title: post.dataValues.title,
				description: post.dataValues.description,
				email: post.dataValues.email,
			};
		});
		res.render('index', {
			data: data,
		});
	});
});

app.get('/postfeature', function (req, res) {
  res.render('postfeature');
});


app.post('/createidea', function (request, response) {
	console.log(request.body);
	Idea.create({
			title: request.body.title,
			categories: request.body.categories,
			description: request.body.description,
			email: request.body.email
	}).then(function(idea) {
		response.redirect('/postfeature');
	});
});

app.get('/koen', function (req, res) {
  res.render('index');
});

sequelize.sync().then(function() {
	var server = app.listen(3000, function() {
		console.log('Example app listening on port: ' + server.address().port);
	});
});
