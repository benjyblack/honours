angular.module('mean.questions').filter('matchType', function() {
	return function(questions, type) {
		var filtered = [];
	    angular.forEach(questions, function(question) {
			if(question.user.type.toLowerCase() === type) {
				filtered.push(question);
			}
	    });
	    return filtered;
	};
});