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


exports.adduser = function(req, res){

    var user_data = req.body.user;

    // I use Date().getTime() to simulate somehow a keygenerator to acces the "API"

    var key = new Date().getTime();
    var usr = new models.User(user_data.username, user_data.password, key, user_data.email, [user_data.contact01, user_data.contact02, user_data.contact03, user_data.contact04, user_data.contact05]);
    users.add_user(usr);
    
    res.render('generic_message', {
        locals:{'message': 'registered! This is your secret key to update your status from anywhere else:<br><h2>'+key+'</h2><br>'}
    });
}


exports.register = function(req, res){
    res.render('registration');
}
