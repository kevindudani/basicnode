var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require('path');
// var env        = require('dotenv').load()
var exphbs = require("express-handlebars");

var handlebars = require('express-handlebars').create({
    layoutsDir: path.join(__dirname, "app/views/layouts"),
    partialsDir: path.join(__dirname, "app/views/partials"),
    defaultLayout: 'layout',
    extname: 'hbs'
});
var flash = require('connect-flash');

require("dotenv").config();

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(flash());

var sessionOpts = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    // store: sessionStore,
    secret: process.env.APP_SECRET,
    cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
}

// For Passport
app.use(
  session(sessionOpts)
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set("views", "./app/views");
// app.engine("hbs", exphbs({ extname: ".hbs" }));
app.engine('hbs', handlebars.engine);
app.set("view engine", ".hbs");

app.get("/", function(req, res) {
    res.redirect('signin');
//   res.send("Welcome to Passport with Sequelize");
});

//Models
var models = require("./app/models");

//Routes
var authRoute = require("./app/routes/auth.js")(app, passport);

//load passport strategies
require("./app/config/passport/passport.js")(passport, models.user);

//Sync Database
models.sequelize
  .sync()
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

app.listen(process.env.PORT, function(err) {
  if (!err) console.log("Site is live");
  else console.log(err);
});
