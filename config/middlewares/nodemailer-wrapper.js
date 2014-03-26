'use strict';


var nodemailer = require('nodemailer'),
	config = require('../config');

var smtpTransport;

exports.open = function() {
	// create reusable transport method (opens pool of SMTP connections)
	smtpTransport = nodemailer.createTransport('SMTP',{
		service: config.nodemailer.service,
		auth: config.nodemailer.auth
	});
};

exports.close = function() {
	smtpTransport.close(); // shut down the connection pool, no more messages
};

exports.getSmtpTransport = function() {
	return smtpTransport;
};

exports.welcomeTemplate = function(user) {
	return {
		from: config.nodemailer.name + ' <' + config.nodemailer.user + '>', // sender address
		to: user.email, // list of receivers
		subject: 'Account Information', // Subject line
		text: 'Hey ' + user.firstName +
			' Welcome to the LectureImprov system. Your account information is as follows:\n\n' +
			'Username: ' + user.email + '\n' +
			'Temporary Password: ' + user.password, // plaintext body
		html:
				'<div>' +
					'<p>Hey ' + user.firstName + '!</p>' +
					'<p>Welcome to the LectureImprov system. Your account information is as follows:</p>' +
				'</div>' +
				'<div>' +
					'<p><b>Username</b>: ' + user.email + '</p>' +
					'<p><b>Temporary Password</b>: ' + user.password + '</p>' +
				'</div>'
	};
};

exports.forgottenPasswordTemplate = function(email, host, token) {

	return {
        from: config.nodemailer.name + ' <' + config.nodemailer.user + '>', // sender address
		to: email,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have' +
			' requested the reset of the password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			'http://' + host + '/reset/' + token + '\n\n' +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n',
		html:
			'<div>' +
				'<p>You are receiving this because you (or someone else) have requested the reset of the password ' +
				'for your account.</p><p>Please click on the following link, or paste this into your browser to ' +
				'complete the process: http://' + host + '/reset/' + token + '</p>' +
				'<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>'
    };
};