$(function() {
  var socket = io.connect('http://' + server + ':' + port);

  socket.on('connect', function() {
    console.log('connect');
  });

  socket.on('disconnect', function() {
    console.log('disconnect');
  });

  socket.on('change', function(log) {
    log = log.replace(/\r\n/g, '<br />');
    log = log.replace(/(\n|\r)/g, '<br />');
    var _log = $('#log').html();
    $('#log').html(_log + log);
    $('html, body').animate({ scrollTop: $('#footer').offset().top }, 'slow');
  });
});
