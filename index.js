var express = require('express');
var app = express();
var sassMiddleware = require('node-sass-middleware');

var srcPath = __dirname + '/sass/';
var destPath = __dirname + '/public/styles';
var path = require('path');

var serveStatic = require('serve-static')

app.use('/styles', sassMiddleware({
  src: srcPath,
  dest: path.join(__dirname, 'public/styles'),
  debug: true,
  outputStyle: 'expanded'
}));

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.use('/',
  serveStatic('./public', {})
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
