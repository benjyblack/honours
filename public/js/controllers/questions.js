angular.module('mean.questions').controller('QuestionsController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;

    $scope.create = function() {
        var question = new Questions({
            content: this.content
        });
        question.$save(function(response) {
            $location.path("questions/" + response._id);
        });

        this.content = "";
    };

    $scope.find = function() {
        Questions.query(function(questions) {
            $scope.questions = questions;
        });
    };

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;
            $scope.answer = '';
        });
    };

    $scope.addAnswer = function() {
        var question = $scope.question;

        // Add answer
        question.answers.push($scope.answer);

        if (!question.updated) {
            question.updated = [];
        }
        question.updated.push(new Date().getTime());

        question.$update(function() {
            $location.path('questions/' + question._id);
        });
    };
}]);