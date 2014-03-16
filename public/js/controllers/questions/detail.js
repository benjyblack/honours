'use strict';

angular.module('mean.questions').controller('QuestionsDetailController',
    ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Visualizations',
    function ($scope, $routeParams, $location, Global, Questions, Visualizations) {
        $scope.global = Global;

        Questions.get($routeParams.questionId).then(function(question) {
            $scope.question = question;
            $scope.visualization =  Visualizations.createVisualization(question);

            $scope.askedByMe = $scope.question.user._id === $scope.global.user._id;
            $scope.nominatedByMe = $scope.question.nominatedBy.indexOf($scope.global.user._id) !== -1;

        });

        $scope.nominate = function() {
            var question = $scope.question;

            $scope.nominatedByMe = !$scope.nominatedByMe;

            question.isNominated = $scope.nominatedByMe;

            question.$update();
        };

        $scope.delete = function() {
            var question = $scope.question;

            question.$delete(function() {
                $location.path('questions');
            });
        };
    }
]);