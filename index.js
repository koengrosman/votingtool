var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sassMiddleware = require('node-sass-middleware');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var pg = require('pg');
var srcPath = __dirname + '/sass/';
var destPath = __dirname + '/public/styles';
var path = require('path');
var serveStatic = require('serve-static')

//set the default view engine
app.set('view engine', 'jade');

var sequelize = new Sequelize('feedbackapp', 'Koen', null, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

sequelize.sync().then(function() {
	http.listen(3000, function(){
  	console.log('listening on *:3000');
});
});


io.on('connection', function(socket){
    socket.on('test', function (data) {
     io.emit('test', data);
  });
});


app.get('/', function(req, res){
	res.render('socket')
});

//middleware for using bodyparser
app.use(bodyParser.urlencoded({
	extended: true
}));

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

app.get('/', function(req, res){
	res.render('socket')
});

app.get('/allideas', function (req, res) {
	Idea.findAll().then(function(posts) {
		var data = posts.map(function(post) {
			return {
				id: post.dataValues.id,
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
