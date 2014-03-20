
/**
 * Load answer
 */

exports.load = function (req, res, next, id) {
	req.question.answers.forEach(function(answer) {
        if (answer._id === id) {
            req.answer = answer;
        }
    });
    if (typeof(req.answer) === 'undefined') return next(new Error('Failed to load answer ' + id));
    next();
};

/**
 * Create answer
 */

exports.create = function (req, res) {
	var question = req.question;
	var user = req.user;

    question.addAnswer(user, req.body, function (err) {
		if (err) return res.render('500');
		res.redirect('/questions/'+ question.id);
	});
};


/**
 * Show answer
 */
exports.show = function(req, res) {
    res.jsonp(req.answer);
};

/**
 * Delete answer
 */
exports.destroy = function (req, res) {
	var question = req.question;
	question.removeAnswer(req.param('answerId'), function (err) {
		if (err) res.send(500);
		res.redirect('/questions/' + question.id);
	});
};

/** 
 * All answers
 */
exports.all = function (req, res) {
	res.jsonp(req.question.answers);
};