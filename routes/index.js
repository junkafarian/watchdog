var models      = require('./models'),
    request     = require('request'),
    twitter     = require('ntwitter'),
    io          = require('socket.io').listen(3003),
    users       = new models.UserList(),
    tSignals    = {};


var twit = new twitter({
      consumer_key: '1NFZuC5z1E0bCjGvtiHFAw',
      consumer_secret: 'uxYCzvY3ju0jN6v0prvnWZJzSKpkhcNBdMIXkTE',
      access_token_key: '30838623-VVTcQRbHMfSoetEDb1bjfeiiohRMWkpmoCUIiuJ0',
      access_token_secret: 'X04ban3VGmUKBklIyDu23LEoy9Tosl9y3r18Ys0n4'
    });



function updateTwitterStream() {

    var allthetwitterids = [];

    for ( var twitterid in tSignals ) {
        allthetwitterids.push(twitterid);
    }

    if (allthetwitterids.length < 1) {
        return
    }

    twit.stream('statuses/filter', {'follow':allthetwitterids.toString()}, function(stream) {
        stream.on('data', function (data) {

            if (data.user != false) {
                user = users.get_user(tSignals[data.user.id])
                if (user != undefined) {
                    user.checkin(models.sources.TWITTER, 'tweeted');
                } else {
                    console.log('got data for unconfigured user: '+user)
                }
            }

        });
    });   
}


function get_statuses() {
    var statuses = [];
    for (var username in users.users) {
        user = users.get_user(username)
        if (user != undefined) {
            // TODO: .check_status() elsewhere
            status = user.check_status();
            statuses.push({'username': user.username,
                           'status': status});
        }
    }
    return statuses;
}

function bootstrap() {
    // bootstrap data
    var dummy = new models.User('dummy', 'password', 'dummy123', 'I might be in trouble, please eat all the vegetables.', 'dummy@example.com');
    users.add_user(dummy);
}

bootstrap();

// Sockets

io.sockets.on('connection', function (socket) {
    var statuses = get_statuses();
    socket.emit('status_update', statuses);
    console.log('new connection opened');
});

// Views

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
        user_status = user.check_status();
        res.render('status', {
            locals: {'username': username,
                     'user_status': user_status,
                     'last_checkins': user_status.checkins}
        });
    } else {
        console.log("Requested status for invalid username: %s", username);
        res.render('404', {
            locals: {'reason': 'User could not be found'}
        });
    }
};

exports.status_listings = function(req, res) {
    var statuses = get_statuses();
    res.render('status_listings', {
        locals: {'statuses': statuses}
    });
}

exports.checkin = function(req, res) {
    var username = req.params.username;
    var user = users.get_user(username);
    
    if (user != undefined) {
        user.checkin(models.sources.SYSTEM, 'online checkin')
        console.log("Checked in for %s: %s", username, user.status);
        res.redirect('/status/' + user.username);
    } else {
        console.log("Checkin for invalid username: %s", username);
        res.render('404', {
            locals: {'reason': 'User could not be found'}
        });
    }
};

exports.testmail = function(req, res){
    var usr = new models.User('gerard', 'gerard123', 'QWERTY', 'I might be in trouble, please eat all the vegetables.', 'gerard@ideesabsurdes.net');
    // users.add_user(usr);
    usr.sendEmail();
}

exports.adduser = function(req, res){

    var user_data = req.body.user;

    // I use Date().getTime() to simulate somehow a keygenerator to acces the "API"

    var key = new Date().getTime();
    var usr = new models.User(user_data.username, '', key, user_data.email, [user_data.contact01, user_data.contact02, user_data.contact03, user_data.contact04, user_data.contact05]);
    users.add_user(usr);
    

    request('https://api.twitter.com/1/users/lookup.json?screen_name='+user_data.twitter, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           var tid = JSON.parse(body)[0].id;
           tSignals[tid] = user_data.username;
           updateTwitterStream();
        }
    })
    res.redirect('/status/' + user_data.username);

}


exports.register = function(req, res){
    res.render('registration');
}
