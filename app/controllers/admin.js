/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    randomstring = require('randomstring'),
    User = mongoose.model('User'),
    csv = require('csv'),
    nodemailer = require('nodemailer'),
    config = require('../../config/config');


// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport('SMTP',{
    service: config.nodemailer.service,
    auth: config.nodemailer.auth
});

/**
 * Import CSV
 */
exports.import = function(req, res) {
    var headerline = [];
    var usersToAdd = [];

    csv().from.path(req.files.file.path, { delimiter: ',', escape: '"' })
    .on('record', function(row,index){
        var i;
        var user;

        // First row will be the headerline
        if (index === 0) {
            for (i = 0; i < row.length; i++) headerline.push(row[i]);
        }
        else {
            user = new User();
            user.type = 'Student';
            user.provider = 'local';
            user.password = randomstring.generate();

            // Populate user fields from csv
            for (i = 0; i < row.length; i++) user[headerline[i]] = row[i];

            usersToAdd.push(user);
        }
    })
    .on('end', function(rowCount){

        var numRecords = rowCount - 1; // one of the rows is the headliner
        var recordsIteratedThrough = 0;
        var successfulUsers = [];
        var failedUsers = [];

        usersToAdd.forEach(function(user) {
            // Save user to the database
            user.save(function(err) {
                if (err && err.err) failedUsers.push(user);
                else successfulUsers.push(user);
                
                recordsIteratedThrough++;
                if (recordsIteratedThrough === numRecords) {
                    // Subscribe successful users asynchronously
                    sendAccountInformationEmail(successfulUsers);

                    if (failedUsers.length === 0) {
                        res.jsonp(201, { message: 'Successfully added ' + numRecords + ' users' });
                    }
                    else {
                        res.jsonp(500, { message: 'Failed to add ' +
                            failedUsers.length + '/' + numRecords + '  users' });
                    }
                }
            });
        });
    })
    .on('error', function(error){
        res.jsonp(500, { message: 'Error parsing CSV file: ' + error.message });
    });
};

var sendAccountInformationEmail = function(users, callback) {
    users.forEach(function(user) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.nodemailer.name + ' <' + config.nodemailer.auth.user + '>', // sender address
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

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    });
};