'use strict';

angular.module('mean.questions').controller('QuestionsAnswerController',
	['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Answers',
	function ($scope, $routeParams, $location, Global, Questions, Answers) {
		$scope.global = Global;

		// initialize question and answer
		Questions
			.get($routeParams.questionId)
			.then(function (question){
				$scope.question = question;
			});

		Answers
			.get({'user._id': $scope.global.user._id, 'question._id' : $routeParams.questionId})
			.then(function(answer) {
				$scope.answer = answer;
			})
			.catch(function() { // if can't find the answer on the server, create a new one
				$scope.answer = Answers.create();
				$scope.answer.user = $scope.global.user._id;
				$scope.answer.question = $routeParams.questionId;
			});

		$scope.submit = function() {
			
			if (typeof($scope.answer._id) !== 'undefined') {
				Answers.update($scope.answer, function(answer) {
					$location.path('questions/' + answer.question._id);
				});
			}
			else {
				Answers.save($scope.answer, function(answer) {
					$location.path('questions/' + answer.question._id);
				});
			}
		};
	}
]);