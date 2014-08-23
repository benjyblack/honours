'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	//winston = require('winston'),
	nodemailer = require('../../config/middlewares/nodemailer-wrapper');


/**
 * User Schema
 */
var UserSchema = new Schema({
	type: String,
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true
	},
	hashed_password: String,
	provider: String,
	salt: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
	return value && value.length;
};

UserSchema.path('firstName').validate(function(firstName) {
	return firstName.length;
}, 'First name cannot be blank');

UserSchema.path('lastName').validate(function(lastName) {
	return lastName.length;
}, 'Last name cannot be blank');

UserSchema.path('email').validate(function(email) {
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
	return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password))
		next(new Error('Invalid password'));
	else
		next();
});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */
	encryptPassword: function(password) {
		if (!password || !this.salt) return '';
		var salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	},

	sendWelcomeEmail: function() {
		var smtpTransport = nodemailer.getSmtpTransport();

        // setup e-mail data with unicode symbols
        var mailOptions = nodemailer.welcomeTemplate(this);

        // log it out
        // winston.log('info', 'Sending welcome email', mailOptions);

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + response.message);
            }
        });
	},

	sendPasswordResetEmail: function(host) {
		var smtpTransport = nodemailer.getSmtpTransport();

        // setup e-mail data with unicode symbols
        var mailOptions = nodemailer.forgottenPasswordTemplate(this.email, host, this.resetPasswordToken);

        // log it out
        // winston.log('info', 'Sending reset password email', mailOptions);

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + response.message);
            }
        });
	}
};

mongoose.model('User', UserSchema);
