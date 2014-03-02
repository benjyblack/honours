/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    randomstring = require('randomstring'),
    User = mongoose.model('User'),
    csv = require('csv');


/**
 * Import CSV
 */
exports.import = function(req, res) {
    var headerline = [];
    var usersToAdd = [];

    csv().from.path(req.files.file.path, { delimiter: ',', escape: '"' })
    .on('record', function(row,index){
        var i;

        // First row will be the headerline
        if (index === 0) {
            for (i = 0; i < row.length; i++) headerline.push(row[i]);
        }
        else {
        
            var user = new User();
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
        var failedUserCount = 0;

        usersToAdd.forEach(function(user) {
            user.save(function(err) {
                if (err && err.err) {
                    failedUserCount++;
                }

                recordsIteratedThrough++;
                if (recordsIteratedThrough === numRecords) {
                    if (failedUserCount === 0)
                        res.jsonp(201, { numSuccess: numRecords });
                    else
                        res.jsonp(500, { numSuccess: (numRecords - failedUserCount), numFailure: failedUserCount });
                }
            });
        });
    })
    .on('error', function(error){
        console.log(error.message);
    });
};
