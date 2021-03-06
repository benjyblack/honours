'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    crypto = require('crypto'),
    randomstring = require('randomstring'),
    nodemailer = require('../../config/middlewares/nodemailer-wrapper');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Forgot Password
 */
exports.forgotGet = function(req, res) {
    res.render('users/forgot', {
        title: 'Forgot Password',
        message: req.flash('error')
    });
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};


/**
 * Forgot Password
 */
exports.forgotPost = function(req, res) {
    crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');

        User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
                req.flash('error', 'No account with that email address exists');
                return res.redirect('/forgot');
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;

            user.save(function() {
                user.sendPasswordResetEmail(req.headers.host);

                res.render('users/forgot-confirm', {
                    title: 'Email sent'
                });
            });
        });
    });
};

/**
 * Reset Password
 */
exports.resetGet = function(req, res) {
    User.findOne(
        { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
        function(err, user) {
            if (!user) {
                res.redirect('/forgot');
            }

            res.render('users/reset', {
                user: req.user,
                token: req.params.token
            });
        }
    );
 };

exports.resetPost = function(req, res) {

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
        function(err, user) {
            if (!user) {
                return res.redirect('/forgot');
            }

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function() {
                req.logIn(user, function(err) {
                    if (err) return res.redirect('/forgot');
                    return res.redirect('/');
                });
            });
        }
    );
};

/**
 * Create user
 */
exports.create = function(req, res) {

    var user = new User(req.body);
    var message = null;

    // TODO: do this better
    user.type = 'student';

    // if no password has been defined, add a random one
    if (typeof(user.password) === 'undefined' || user.password.length <= 0)
    {
        user.password = randomstring.generate();
    }

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch(err.code){
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }

            return res.render('users/signup', {
                message: message,
                user: user
            });
        }

        user.sendWelcomeEmail();

        return res.redirect('/');
    });
};

/**
 * Update user
 */
exports.update = function(req, res) {
    var user = req.user;

    user = _.extend(user, req.body);

    user.save(function() {
        return res.jsonp(user);
    });
};

/** TODO: Remove this
 * Create Professor
 */
exports.createProfessor = function(req, res) {

    req.body.firstName = 'Mr';
    req.body.lastName = 'Professor';
    req.body.email = 'professor@gmail.com';
    req.body.password = 'professor';
    req.body.type = 'professor';

    var user = new User(req.body);
    var message = null;

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch(err.code){
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default: 
                    message = 'Please fill all the required fields';
            }

            return res.render('users/signup', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Show a user
 */
exports.show = function(req, res) {
    res.jsonp(req.user);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};


/**
 * List of Users
 */
exports.all = function(req, res) {
    User
        .find()
        .sort('-lastName')
        .exec(function(err, users) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(users);
            }
        });
};