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
    var username = req.params.username;
    var user = users.get_user(username);
    
    if (user != undefined) {
        user.alert();
        
        console.log("Alert received and processed for %s", username);
        res.render('alert', {
            locals: {'username': username}
        });
    } else {
        console.log("Alert received for invalid username: %s", username);
        res.render('failed_alert', {
            locals: {'username': username,
                     'reason': 'User could not be found'}
        });
    }
};

