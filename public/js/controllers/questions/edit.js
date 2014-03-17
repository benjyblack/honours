'use strict';

angular.module('mean.questions').controller('QuestionsEditController',
	['$scope', '$routeParams', '$location', 'Global', 'Questions',
	function ($scope, $routeParams, $location, Global, Questions) {
		$scope.global = Global;
		$scope.action = $routeParams.questionId ? 'edit' : 'create';

		// initialize question
		if ($scope.action === 'create')
			$scope.question = Questions.create();
		else {
			Questions.get($routeParams.questionId).then(function (question){
				$scope.question = question;
			});
		}

		$scope.submit = function() {
			if ($scope.action === 'create') {
				Questions.save($scope.question, function(response) {
					$location.path('questions/' + response._id);
				});
			}
			else {
				Questions.update($scope.question, function() {
					$location.path('questions/' + $scope.question._id);
				});
			}
		};

		$scope.addPossibleAnswer = function() {
			$scope.question.possibleAnswers.push('');
		};

		$scope.removePossibleAnswer = function(index) {
			$scope.question.possibleAnswers.splice(index, 1);
			if (index == $scope.question.correctAnswerIndex)
				$scope.question.correctAnswerIndex = 0;
		};

		$scope.canSubmit = function() {
			var question = $scope.question;

			if (typeof(question) === 'undefined' ||
				typeof(question.content) === 'undefined' ||
				question.content.length === 0)
				return false;

			if (question.type === 'multiplechoice')
			{
				// check all answers, if any are empty, we can't submit
				var isEmpty = false;
				question.possibleAnswers.forEach(function(answer) {
					if (typeof(answer) === 'undefined' || answer.length === 0) isEmpty = true;
				});

				if (isEmpty === true) return false;
			}

			return true;
		};

		if ($scope.action === 'create') {
			$scope.$watch('question.type', function(value) {
				if (value === 'text') {
					$scope.question.possibleAnswers = null;
					$scope.question.correctAnswerIndex = null;
				}
				else if (value === 'truefalse') {
					$scope.question.possibleAnswers = ['False', 'True'];
					$scope.question.correctAnswerIndex = 0;
				}
				else if (value === 'multiplechoice') {
					$scope.question.possibleAnswers = [''];
					$scope.question.correctAnswerIndex = 0;
				}
			});
		}
	}
]);