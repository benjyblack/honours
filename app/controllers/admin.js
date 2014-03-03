/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    randomstring = require('randomstring'),
    User = mongoose.model('User'),
    csv = require('csv'),
    mcapi = require('mailchimp-api'),
    config = require('../../config/config');


mc = new mcapi.Mailchimp(config.mailchimp.apikey);

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
                    // TODO: Handle errors in subscription
                    subscribeUsersToList(successfulUsers, config.mailchimp.listId);

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

var subscribeUsersToList = function(users, listId, callback) {

    users.forEach(function(user) {
        mc.lists.subscribe(
            {
                id: listId,
                email:{
                    email: user.email
                },
                merge_vars: {
                    fname: user.firstName,
                    lname: user.lastName,
                    password: user.password
                }
            },
            function(data) {
                
            },
            function(error) {
                if (error.error) {
                }
        });
    });
};