
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', server: server, port: port });
};
