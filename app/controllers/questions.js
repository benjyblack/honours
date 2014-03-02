/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Question = mongoose.model('Question'),
    _ = require('lodash');


/**
 * Find question by id
 */
exports.question = function(req, res, next, id) {
    Question.load(id, function(err, question) {
        if (err) return next(err);
        if (!question) return next(new Error('Failed to load question ' + id));
        req.question = question;
        next();
    });
};

/**
 * Create a question
 */
exports.create = function(req, res) {
    var question = new Question(req.body);
    question.user = req.user;

    question.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                question: question
            });
        } else {
            res.jsonp(201, question);
        }
    });
};

/**
 * Update a question
 */
exports.update = function(req, res) {
    var question = req.question;

    question = _.extend(question, req.body);

    // Populate the question with the nominatedBy field
    question.populate('nominatedBy');

    // If question has been nominated by the user, add the current user to the nominatedBy array
    if ( req.question.isNominated )
    {
        if ( question.nominatedBy.indexOf(req.user._id) === -1 )
            question.nominatedBy.push(req.user);
    }
    // If question not nominated by this user, then check to see if they had previously nominated it, if they had, remove it
    else
    {
        var index = question.nominatedBy.indexOf(req.user._id);
        if ( index != -1 )
            question.nominatedBy.splice(index, 1);
    }

    // If a new answer has been added, mark the current user as the owner of it
    for (var i = 0; i < req.body.answers.length; i++) {
        if (req.body.answers[i].hasOwnProperty('isNew')) {
            question.answers[i].user = req.user;
        }
    }

    question.save(function(err) {
        res.jsonp(question);
    });
};

/**
 * Delete a question
 */
exports.destroy = function(req, res) {
    var question = req.question;

    question.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(question);
        }
    });
};

/**
 * Show a question
 */
exports.show = function(req, res) {
    res.jsonp(req.question);
};

/**
 * List of Questions
 */
exports.all = function(req, res) {
    Question.find().sort('-created').populate('user', 'firstName lastName email type nominatedBy').exec(function(err, questions) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(questions);
        }
    });
};