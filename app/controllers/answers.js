
/**
 * Load answer
 */

exports.load = function (req, res, next, id) {
	req.question.answers.forEach(function(answer) {
        if (answer._id.toString() === id) {
            req.answer = answer;
            next();
        }
    });
};

/**
 * Create answer
 */

exports.create = function (req, res) {
	var question = req.question;
	var user = req.user;

    question.addAnswer(user, req.body, function (err, question) {
		if (err) return res.render('500');
		res.location('/questions/' + question._id.toString());
		res.jsonp(201, question);
	});
};

/**
 * Create answer
 */

exports.update = function (req, res) {
	var question = req.question;
	var newAnswer = req.body;

    question.updateAnswer(newAnswer, function (err) {
		if (err) return res.render('500');
		res.jsonp(200, question);
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
		res.jsonp(200, question);
	});
};

/** 
 * All answers
 */
exports.all = function (req, res) {
	res.jsonp(req.question.answers);
};