const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var http = require('http');
var sio = require('socket.io');
var config = require('./config');
var restify = require('restify');

// Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrype = require('bcryptjs');
const cors = require("cors");

// Options for MySQL Session Store
var options =  config.DB;
var mysql = require('mysql');
var sessionStore = new MySQLStore(options);

//Init Server
const server = express();

//Middleware
//server.use(bodyParser.json()); /**Creates issues on req.body, restify.plugins.bodyparser works */
server.use(restify.plugins.bodyParser());
server.use(bodyParser.urlencoded({ extended : false }));
server.use(cors());

// Express Session
server.use(session({
    secret: 'hsjcnxQlk$cx!',
    saveUninitialized: false,
    resave: false,
    store: sessionStore
}));

// Passport init
server.use(passport.initialize());
server.use(passport.session());

// Express Validator
server.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Connect Flash
server.use(flash());

//Global Vars
server.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Incude Routes
require("./routes/api/BackEndRestAPI")(server);
require("./routes/api/UserAuthenticationAPI")(server);


//Start Server
server.listen(config.PORT, () => console.log(`Server started on port ${config.PORT}`));

