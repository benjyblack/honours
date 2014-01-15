angular.module('mean.questions').controller('QuestionsDetailController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;
            $scope.answer = '';
        });
    };

    $scope.delete = function() {
        var question = $scope.question;

        question.$delete(function() {
            $location.path('questions/');
        });
    };
}]);