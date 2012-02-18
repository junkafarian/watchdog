
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    locals: {
        title: 'Watchdog'
    }
});
};


/*
 * GET alert call
 */

exports.alert = function(req, res, next){
    var key = req.params.key;

    // TODO: - lookup user based on `key`
    //       - send alerts
    //       - update user status

    res.render('alert', {
        locals: {'key': key}
    });
};




