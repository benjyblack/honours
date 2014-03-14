angular.module('mean.questions').controller('QuestionsEditController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'QuestionsInit', function ($scope, $routeParams, $location, Global, Questions, QuestionsInit) {
    $scope.global = Global;
    $scope.action = $routeParams.questionId ? 'edit' : 'create';

    $scope.promise = QuestionsInit.init($scope.action);

    $scope.promise.then(function (question){
        $scope.question = question;

        if (typeof($scope.question.answers) !== 'undefined')
        {
            $scope.question.answers.forEach(function(answer) {
                if (answer.user._id === $scope.global.user._id)
                    $scope.answer = answer;
            });
        }
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

    $scope.submitAnswer = function() {
        var question = $scope.question;

        // Add answer if it didn't already exist as part of the question
        if (typeof($scope.answer._id) === 'undefined')
        {
            $scope.answer.user = $scope.global.user;
            question.answers.push($scope.answer);
        }

        if (!question.updated) {
            question.updated = [];
        }
        question.updated.push(new Date().getTime());

        question.$update(function() {
            $location.path('questions/' + question._id);
        });
    };

    $scope.canSubmit = function() {
        var question = $scope.question;

        if (typeof(question.content) === 'undefined' || question.content.length === 0) return false;

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
}]);