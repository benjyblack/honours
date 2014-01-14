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

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;
        });
    };
}]);