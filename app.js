/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io')
  , fs = require('fs');

// env
var server_host = 'logmonit';
var port = 3000;

// all environments
var app = express();
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
var io = socketio.listen(server);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// watch log file
var log_prefix = 'development.log';
var reg = new RegExp('^' + log_prefix + '$');
var log_file = null;
var log_dir = '/home/toyotome/work/sp/log';
fs.readdir(log_dir, function(err, files) {
  for (var i = 0; i < files.length; i++) {
    if (reg.test(files[i])) {
        log_file = log_dir + '/' + files[i];
        break;
    }
  }

  fs.open(log_file, 'r', '0666', function(err, fd) {
    if (err) {
      throw err;
    }
  
    fs.watchFile(log_file, { interval: 1000 }, function (cur, prev) {
      if (cur.size != prev.size) {
        var buf_size = 1024;
        for (var pos = prev.size; pos < cur.size; pos += buf_size) {
          if (err) {
            throw err;
          }
  
          var buf = new Buffer(buf_size);
          fs.read(fd, buf, 0, buf_size, pos, function(err, bytesRead, buffer) {
            var log = buffer.toString('utf8', 0, bytesRead);
            io.sockets.emit('change', log);
          });
        }
      }
    });
  });
});


//app.get('/', routes.index);
app.get('/', function(req, res) {
  res.render('index', { title: 'logmonit', server: server_host, port: port });
});

app.get('/users', user.list);

