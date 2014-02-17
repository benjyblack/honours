angular.module('mean.questions').controller('QuestionsCreateController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;
    $scope.action = 'create';

    $scope.question = new Questions({ type: 'text' });

    $scope.submit = function() {
        $scope.question.$save(function(response) {
            $location.path('questions/' + response._id);
        });
    };

    $scope.addPossibleAnswer = function() {
        $scope.question.possibleAnswers.push('');
    };

    $scope.removePossibleAnswer = function(index) {
        $scope.question.possibleAnswers.splice(index, 1);
        if (index == $scope.question.correctAnswerIndex) 
            $scope.question.correctAnswerIndex = 0;
    };

    $scope.$watch('question.type', function(value) {
        if (value === 'text') {
            $scope.question.possibleAnswers = null;
            $scope.question.correctAnswerIndex = null;
        }
        else if (value === 'truefalse') {
            $scope.question.possibleAnswers = ['False', 'True'];
            $scope.question.correctAnswerIndex = 0;
        }
        else {
            $scope.question.possibleAnswers = [''];
            $scope.question.correctAnswerIndex = 0;
        }
    });
}]);