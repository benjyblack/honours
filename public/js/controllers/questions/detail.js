angular.module('mean.questions').controller('QuestionsDetailController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Charts', function ($scope, $routeParams, $location, Global, Questions, Charts) {
    $scope.global = Global;

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;

            if (question.type === 'truefalse')
              $scope.chart = Charts.createTrueFalseChart(question);
            else if (question.type === 'multiplechoice')
              $scope.chart = Charts.createMultipleChoiceChart(question);
        });
    };

    $scope.delete = function() {
        var question = $scope.question;

        question.$delete(function() {
            $location.path('questions/');
        });
    };

}]);