var nodemailer = require("nodemailer");
var asv = require('./versions/asv.js');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
});

console.log("DETAILS:")
console.log("Name: " + process.env.NAME)
console.log("Email: " + process.env.EMAIL);
console.log("EmailPass: " + process.env.EMAILPASS);

var app;
module.exports.init = function(passed_app){
  app = passed_app;
}

module.exports.sendEmails = function(){
  app.db.users.find({}, function (err, docs) {
    if(err){
      console.log(err);
    } else {
      for(var cnt = 0; cnt < docs.length; cnt++){
        console.log(docs[cnt]);
        var now = Date.now(); // fake offset + 86000*365000
        var diff = now - docs[cnt].created;
        var num_days = Math.ceil(diff/1000/86000);
        send_daily_email(docs[cnt], num_days);
      }
    }
  });
};

function send_daily_email(who, days){
  var chapter = days % 1189;
  var result = get_book_chap(chapter);
  var generated = genText(result.b, result.c);
  var mailOptions = {
    from: process.env.NAME + " <" + process.env.EMAIL + ">", // sender address
    to: who.fname + " " + who.lname + " <" + who.email + ">", // list of receivers
    subject: "Your Daily Reading",
    text: generated.text,
    html: generated.html
  }

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }
    smtpTransport.close();
  });
}

function get_book_chap(chapter){
  var chap_num = 1;
  var last_chap = 1;
  for(var cnt = 0; cnt < asv.length; cnt++){
    if(chap_num == chapter){
      return { b: asv[cnt].b, c: asv[cnt].c };
    } else {
      if(last_chap != asv[cnt].c){
        chap_num++;
        last_chap = asv[cnt].c;
      }
    }
  }
}

function genText(book, chapter){
  // data to return
  var ret = {
    text: '',
    html: ''
  };
  // simple switch
  var found = false;
  // find the chapter
  for(var cnt = 0; cnt < asv.length; cnt++){
    if(asv[cnt].b == book && asv[cnt].c == chapter){
      ret.html += ' <b>' + asv[cnt].v + '</b>' + ' ' + asv[cnt].t;
      ret.text += ' ' + asv[cnt].v + ' ' + asv[cnt].t;
      found = true;
    } else {
      if(found)
        break;
    }
  }
  return ret;
}
