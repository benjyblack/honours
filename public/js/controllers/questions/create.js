angular.module('mean.questions').controller('QuestionsCreateController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;
    $scope.question = new Questions({ type: 'text', possibleanswers: [''] });

    $scope.selectedAnswerIndex = 0; // only used with multiple choice questions

    $scope.create = function() {
        if ($scope.question.type === 'multiplechoice')
            $scope.correctanswer = $scope.question.possibleanswers[$scope.selectedAnswer];

        $scope.question.$save(function(response) {
            $location.path('questions/' + response._id);
        });
    };

    $scope.addChoice = function() {
        $scope.question.possibleanswers.push('');
    };

    $scope.removeChoice = function(index) {
        $scope.question.possibleanswers.splice(index, 1);
        if (index == $scope.selectedAnswerIndex) $scope.selectedAnswerIndex = 0;
    };
}]);