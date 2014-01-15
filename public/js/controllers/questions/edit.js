angular.module('mean.questions').controller('QuestionsEditController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;
    
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