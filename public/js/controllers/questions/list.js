'use strict';

angular.module('mean.questions').controller('QuestionsListController',
	['$scope', '$routeParams', 'Global', 'Questions',
	function ($scope, $routeParams, Global, Questions) {
		
		$scope.global = Global;
		$scope.type = $routeParams.type || 'professor';
		$scope.header = $scope.type === 'professor' ? 'Professor\'s Questions' : 'Student\'s Questions';

		Questions.getAll().then(function(questions){

			$scope.questions = [];

			questions.forEach(function(question) {
				if (question.user.type === $scope.type) $scope.questions.push(question);
			});
		});
	}
]);