const restify = require("restify");
const errors = require('restify-errors');
const config = require('../../config');

var sys = require('util')
var exec = require('child_process').exec;
var child;
var child2;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
const saltRounds = 10;

// Database Connection const connection = require('../db.js');
const mysql = require('mysql');
const  connection = mysql.createConnection({host: config.DB.host, user: config.DB.user, password: config.DB.password, database: config.DB.database});

module.exports = server => {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log("--> Running serializeUser()");
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        connection
            .query("select * from cms where id = " + user.id, function (err, rows) {
                if (err) 
                    throw err;
                console.log('--> Running deserializeUser(), id: ' + rows[0].id);
                done(null, rows[0].id);
            });
    });

    // Local Login using Passport
    passport.use(new LocalStrategy({
        // by default, local strategy uses username and password, we will override with
        // email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function (req, username, password, done) {
        // callback with username and password from our form
        connection
            .query('SELECT * FROM cms WHERE username = ?', [username], function (err, results, fields) {
                if (err) {
                    done(err);
                }

                if (results.length == 0) {
                    done(null, false, {message: 'Unknown User'});
                } else {
                    const hash = results[0]
                        .password
                        .toString();

                    bcrypt.compare(password, hash, function (err, res) {
                        if (res) {
                            return done(null, results[0]);
                        } else {
                            return done(null, false, {message: 'Invalid password'});
                        }
                    });
                }
            });
    }));

    server.post('/api/register', (req, res, next) => {
        var rawData = JSON.parse(req.body);
        var username = rawData.userName;
        var password = rawData.password;
        var organization = rawData.organization;

        bcrypt.hash(password, saltRounds, function (err, hash, done) {
            connection
                .query("select * from cms where username = '" + username + "'", function (err, rows) {
                    console.log(rows);
                    console.log("above row object");
                    if (err) {
                        throw err;
                    }
                    if (rows.length) {
                        // return done(null, false, req.flash('signupMessage', 'That username is already
                        // taken.')); req.flash('error_msg', 'Username already taken');
                        res.redirect('/api/register');

                    } else {
                        // if there is no user with that username create the user
                        var newUserMysql = new Object();
                        newUserMysql.username = username;
                        newUserMysql.password = password; // use the generateHash function in our user model
                        newUserMysql.organization = organization;

                        var insertQuery = "INSERT INTO cms ( username, password, organization ) VALUES (?, ?, ?)";
                        connection.query(insertQuery, [
                            username, hash, organization
                        ], function (err, rows) {
                            //newUserMysql.id = rows.insertId;
                            if (err) 
                                throw err;
                            
                            // return done(null, newUserMysql); connection.query('');
                            // req.flash('success_msg', 'User registered successfully');
                            // res.redirect('/api/register');
                            res
                                .status(200)
                                .send({
                                    body: JSON.stringify({
                                        msg: username + " successfully registered!"
                                    })
                                });
                            next();
                        });
                    }
                });
            console.log(username);
        });
    });

    server.post('/api/login', (req, response, next) => {
        var rawData = JSON.parse(req.body);
        var username = rawData.userName;
        var password = rawData.password;

        bcrypt.hash(password, saltRounds, function (err, hash, done) {
            connection
                .query("select * from cms where username = '" + username + "'", function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    if (rows.length) {
                        // return done(null, false, req.flash('signupMessage', 'That username is already
                        // taken.')); req.flash('error_msg', 'Username already taken');
                        const hash = rows[0]
                            .password
                            .toString();
                        const userId = rows[0]
                            .id
                            .toString();
                        const userName = rows[0]
                            .organization
                            .toString();
                        bcrypt.compare(password, hash, function (err, res) {
                            if (res) {
                                //return done(null, results[0]);
                                response
                                    .status(200)
                                    .send({
                                        body: JSON.stringify({msg: "Password Matched", code: 200}),
                                        userId: userId,
                                        userName: userName
                                    });
                                next();
                            } else {
                                //return done(null, false, { message: 'Invalid password' });
                                response
                                    .status(401)
                                    .send({
                                        body: JSON.stringify({msg: "Invalid Password", code: 401})
                                    });
                                next();
                            }
                        });
                    } else {
                        // if there is no user with that username create the user
                        response
                            .status(404)
                            .send({
                                body: JSON.stringify({
                                    msg: username + " not found",
                                    code: 404
                                })
                            });
                        next();
                    }
                });
        });

    });
}

module.exports.getHashedPassword = function (userName) {
    const hash = 'initial';
    connection.query("select * from cms where username = ?", [userName] , function (err, rows) {
        if (err) 
            throw err;
        if (rows.length) {
            hash = rows[0].password.toString();
           console.log(rows.password);
        }
    });
    return hash;
};
