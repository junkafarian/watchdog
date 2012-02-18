var models 	= require('./models');
var users 	= new models.UserList();

function bootstrap() {
    // bootstrap data
    var dummy = new models.User('dummy', 'password', 'dummy123', 'I might be in trouble, please eat all the vegetables.', 'dummy@example.com');
    users.add_user(dummy);
}

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

exports.status = function(req, res) {
    var username = req.params.username;
    var user = users.get_user(username);
    
    if (user != undefined) {
        console.log("Requested status for %s: %s", username, user.status);
        res.render('status', {
            locals: {'username': username,
                     'status': user.status}
        });
    } else {
        console.log("Requested status for invalid username: %s", username);
        res.render('404', {
            locals: {'reason': 'User could not be found'}
        });
    }
};

exports.status_listings = function(req, res) {
    var statuses = [];
    for (var username in users.users) {
        user = users.get_user(username)
        if (user != undefined) {
            statuses.push({'username': user.username,
                           'status': user.status});
        }
    }
    res.render('status_listings', {
        locals: {'statuses': statuses}
    });
}

exports.testmail = function(req, res){
    var usr = new models.User('gerard', 'gerard123', 'QWERTY', 'I might be in trouble, please eat all the vegetables.', 'gerard@ideesabsurdes.net');
    // users.add_user(usr);
    usr.sendEmail();
}
