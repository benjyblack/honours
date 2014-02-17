angular.module('mean.questions').controller('QuestionsEditController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;
    
    $scope.action = 'edit';

    Questions.get({
        questionId: $routeParams.questionId
    }, function(question) {
        $scope.question = question;
    });

    $scope.submit = function() {
        $scope.question.$update(function() {
            $location.path('questions/' + $scope.question._id);
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

    $scope.addAnswer = function() {
        var question = $scope.question;

        // Add answer
        question.answers.push({ content: $scope.answer, isNew: true });

        if (!question.updated) {
            question.updated = [];
        }
        question.updated.push(new Date().getTime());

        question.$update(function() {
            $location.path('questions/' + question._id);
        });
    };
}]);