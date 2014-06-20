var asv = require('./versions/asv.js');
var email = require('./email.js');

var app;
module.exports = function(passed_app){
  app = passed_app;
  app.get('/', signupPage);
  app.post('/', finishSignup);
  // initialise the email object
  email.init(app);
  app.get('/sendemails', function(req, res){ email.sendEmails(); res.send(''); } );
};

function signupPage(req, res){
  res.render('signup');
}

function finishSignup(req, res){
  var new_user = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    created: Date.now() // current timestamp
  };
  console.log(new_user);
  app.db.users.insert(new_user, function(err){
    if(err) console.log(err);
  })
  res.render('thankyou');
}
