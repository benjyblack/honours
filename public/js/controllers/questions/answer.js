'use strict';

angular.module('mean.questions').controller('QuestionsAnswerController',
	['$scope', '$routeParams', '$location', 'Global', 'Questions',
	function ($scope, $routeParams, $location, Global, Questions) {
		$scope.global = Global;

		// initialize question and answer
		Questions
			.get($routeParams.questionId)
			.then(function (question){
				$scope.question = question;

				// Create a new answer for this question. This will be overriden below if one already exits
				$scope.answer = Questions.Answers.create();

				$scope.question.answers.forEach(function(answer) {
					if (answer.user._id === $scope.global.user._id) {
						Questions.Answers
							.get($scope.question._id, answer._id)
							.then(function(answer) {
								$scope.answer = answer;
							});
					}
				});
			});

		$scope.delete = function() {
			Questions.Answers.delete($scope.question._id, $scope.answer._id, function(question) {
				$location.path('questions/' + question._id);
			});
		};

		$scope.submit = function() {
			
			if (typeof($scope.answer._id) !== 'undefined') {
				Questions.Answers.update($scope.question._id, $scope.answer._id, $scope.answer, function(question) {
					$location.path('questions/' + question._id);
				});
			}
			else {
				Questions.Answers.save($scope.question._id, $scope.answer, function(question) {
					$location.path('questions/' + question._id);
				});
			}
		};
	}
]);