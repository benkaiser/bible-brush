var asv = require('./versions/asv.js');

module.exports = function(app){
  app.get('/', signupPage);
  app.post('/', finishSignup);
};

function signupPage(req, res){
  res.render('signup');
}

function finishSignup(req, res){
  console.log(req.body);
  res.render('thankyou');
}
