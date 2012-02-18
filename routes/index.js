var models 	= require('./models');
var users 	= new models.UserList();

exports.index = function(req, res){
  res.render('index', {
    locals: {
        title: 'Watchdog'
    }
});
};

exports.signedin = function(req, res){
  res.render('signedin', {
    locals: {
        status: 'safe'
    }
});
};

exports.alert = function(req, res){
    var key = req.params.key;

    // TODO: - lookup user based on `key`
    //       - send alerts
    //       - update user status

    res.render('alert', {
        locals: {'key': key}
    });
};

