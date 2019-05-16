var exports = module.exports = {}
var path = require('path');
const https = require('https');

exports.signup = function(req,res){

  res.render('signup', {
    layout: 'layout',
    template: 'signup-template',
    title: 'Signup Page',
    error: req.flash('error')
  }); 

}

exports.signin = function(req,res){

  res.render('signin', {
    layout: 'layout',
    template: 'signin-template',
    title: 'Signin Page',
    error: req.flash('error')
  }); 

}

exports.dashboard = function(req,res){

  let userId = req.user.id;
  https.get('https://jsonplaceholder.typicode.com/todos?userId='+userId, (response) => {
    let todo = '';

    // called when a data chunk is received.
    response.on('data', (chunk) => {
      todo += chunk;
    });

    // called when the complete response is received.
    response.on('end', () => {
      console.log(JSON.parse(todo));
    });

  }).on("error", (error) => {
    console.log("Error: " + error.message);
  });

  res.render('dashboard', {
    layout: 'layout-admin',
    template: 'admin-template',
    title: 'Dashboard Page',
    error: req.flash('error')
  }); 

	// res.render('dashboard'); 

}

exports.logout = function(req,res){

  req.session.destroy(function(err) {
    res.redirect('/signin');
  });

}