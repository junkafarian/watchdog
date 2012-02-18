
// UserList
//
//
//

var email = require('mailer');

function UserList(){
    this.users = {};
}

UserList.prototype.add_user = function(new_user) { this.users[new_user.get_username()] = new_user; };
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
    this.panic_status = false;
    this.checkins     = [ new Checkin(new Date().getTime(), null, username, 'created account') ];
}
User.prototype.get_username     = function() { return this.username; };
User.prototype.get_password     = function() { return this.password; };
User.prototype.get_key 	        = function() { return this.key; };
User.prototype.get_email        = function() { return this.email; };
User.prototype.get_emailto      = function() { return this.email_to; };
User.prototype.get_panic_status = function() { return this.panic_status; };
User.prototype.get_checkins     = function() { return this.checkins; };
User.prototype.get_last_checkin = function() { return this.checkins[checkins.length - 1]; };


User.prototype.checkin = function(checkin) { this.checkins.push(checkin); }
User.prototype.alert = function() { 
    var checkin = new Checkin(new Date().getTime(), null, this.username, 'panic alert')
    this.checkins.push(checkin);
    this.panic_status = 'offline'
    // send alerts & notifications
}
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
User.prototype.get_date_time = function() { return this.date_time; };
User.prototype.get_location  = function() { return this.location; };
User.prototype.get_source    = function() { return this.source; };
User.prototype.get_action    = function() { return this.action; };


exports.User 	= User;
exports.Checkin = Checkin;
exports.UserList = UserList;