angular.module('mean.questions').controller('QuestionsEditController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'QuestionsInit', function ($scope, $routeParams, $location, Global, Questions, QuestionsInit) {
    $scope.global = Global;
    $scope.action = $routeParams.questionId ? 'edit' : 'create';

    $scope.promise = QuestionsInit.init($scope.action);

    $scope.promise.then(function (question){
        $scope.question = question;
    });

    $scope.submit = function() {
        if ($scope.action === 'create') {
            $scope.question.$save(function(response) {
                $location.path('questions/' + response._id);
            });
        }
        else {
            $scope.question.$update(function() {
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
}]);