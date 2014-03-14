'use strict';

angular.module('mean.questions').controller('QuestionsListController',
	['$scope', '$routeParams', 'Global', 'Questions',
	function ($scope, $routeParams, Global, Questions) {
		$scope.global = Global;
		$scope.type = $routeParams.type || 'professor';
		$scope.header = $scope.type === 'professor' ? 'Professor\'s Questions' : 'Student\'s Questions';

		$scope.find = function() {
			Questions.query(function(questions) {
				$scope.questions = questions;
			});
		};
	}
]);