
/**
 * Create nomination
 */

exports.create = function (req, res) {
	var question = req.question;
	var user = req.user;

    question.addNomination(user, function (err, question) {
		if (err) return res.render('500');
		res.location('/questions/' + question._id.toString());
		res.jsonp(201, question);
	});
};

/**
 * Delete nomination
 */
exports.destroy = function (req, res) {
	var question = req.question;
	question.removeNomination(req.param('userId'), function (err) {
		if (err) res.send(500);
		res.jsonp(200, question);
	});
};


/** 
 * All nominations
 */
exports.all = function (req, res) {
	res.jsonp(req.question.nominatedBy);
};