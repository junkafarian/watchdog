var email = require('mailer');

var sources = {};
sources.SYSTEM = 'system';
sources.TWITTER = 'twitter';

// Time thresholds for each source (in minutes).
// `active` - User is ok
// `unknown` - User has not checked in recently but is not considered detained
// `offline` - User has not checked in and is considered detained
var CONFIG_DEFAULTS = {};
CONFIG_DEFAULTS[sources.SYSTEM] = {
    'active': 1,
    'unknown': 10,
    'offline': 30
};

CONFIG_DEFAULTS[sources.TWITTER] = {
    'active': 5,
    'unknown': 10,
    'offline': 30
};

// UserList
//
//
//

function UserList(){
    this.users = {};
}

UserList.prototype.add_user = function(new_user) { this.users[new_user.username] = new_user; };
UserList.prototype.get_user = function(username) { return this.users[username];};

// User
//
//
//

function User(username, password, key, email, email_to) {
    this.username     = username;
    this.password     = password;
    this.key          = key;
    this.email        = email;
    this.email_to     = email_to;
    this.status       = 'ok';
    this.config       = {};
    // configure the user with the system settings
    this.config[sources.SYSTEM] = CONFIG_DEFAULTS[sources.SYSTEM]
    this.checkins     = []; 
    this.checkin(sources.SYSTEM, 'created account');
}
User.prototype.get_username     = function() { return this.username; };
User.prototype.get_password     = function() { return this.password; };
User.prototype.get_key 	        = function() { return this.key; };
User.prototype.get_email        = function() { return this.email; };
User.prototype.get_emailto      = function() { return this.email_to; };
User.prototype.get_status       = function() { return this.status; };
User.prototype.get_checkins     = function() { return this.checkins; };
User.prototype.get_last_checkin = function() { return this.checkins[checkins.length - 1]; };
User.prototype.get_config = function() {
    config = {}
    for (var source in this.config) {
        if (this.config[source] != undefined) {
            config[source] = this.config[source]
        } else {
            config[source] = CONFIG_DEFAULTS[source]
        }
    }
    return config
}

User.prototype.checkin = function(source, message) {
    var checkin = new Checkin(new Date().getTime(), null, source, message);
    this.checkins.push(checkin);
    console.log('User %s checked in via %s', this.username, source);
};
User.prototype.alert = function() { 
    this.checkin(sources.SYSTEM, 'panic alert');
    this.status = 'offline'
    // send alerts & notifications
};
User.prototype.check_status = function() {
    var now = new Date();
    var status = 'offline';
    var last_checkins = [];
    var active_sources = [];
    var config = this.get_config();

    // for each configured source 
    for (var key in config) {
        thresholds = config[key];
        var last_checkin = null;
        for (var i=this.checkins.length-1; checkin=this.checkins[i], i>=0; i--) {
	    if (checkin.source == key) {console.log(checkin); last_checkin = checkin; break}
        }
        
        if (last_checkin == null)
            continue

        if (status != 'active') {
            console.log('last checkin for %s through %s was at %s', this.username, key, last_checkin.date_time);

            var unknown = new Date();
            unknown.setMinutes(unknown.getMinutes() - thresholds['unknown']);
            var active = new Date();
            active.setMinutes(active.getMinutes() - thresholds['active']);
            
            if (last_checkin.date_time > active){
                source_status = 'active';
                status = source_status;
                active_sources.push(key);
            } else if (last_checkin.date_time > unknown) {
                source_status = 'unknown';
                if (status != 'active') 
                    status = source_status;
            }
            last_checkins.push({'checkin': last_checkin, 'status': source_status});
            
        }
    }
    this.status = status;
    return {'status': this.status,
            'active_sources': active_sources,
            'checkins': last_checkins}
};

User.prototype.sendEmail        = function(){
    
    email.send({

      host : "localhost",              // smtp server hostname
      port : "25",                     // smtp server port
      ssl: false,                        // for SSL support - REQUIRES NODE v0.3.x OR HIGHER
      domain : "localhost",            // domain used by client to identify itself to server
      to : this.email_to.toString(),
      from : "alert@amnestywatchdog.im",
      subject : "Automatic Alert Message",
      body: this.email,
      authentication : null,        // auth login is supported; anything else is no auth
      //username : "my_username",        // username
      //password : "my_password"         // password

    },
    function(err, result){
      if(err){ console.log(err); }
    });

}

// Checkin
//
//
//


function Checkin(date_time, location, source, action) {
    this.date_time = date_time;
    this.location  = location;
    this.source    = source;
    this.action    = action;
}
Checkin.prototype.get_date_time = function() { return this.date_time; };
Checkin.prototype.get_location  = function() { return this.location; };
Checkin.prototype.get_source    = function() { return this.source; };
Checkin.prototype.get_action    = function() { return this.action; };


exports.User 	       = User;
exports.Checkin        = Checkin;
exports.UserList       = UserList;
exports.sources = sources;
