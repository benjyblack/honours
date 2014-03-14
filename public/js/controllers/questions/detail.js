'use strict';

angular.module('mean.questions').controller('QuestionsDetailController',
    ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Visualizations',
    function ($scope, $routeParams, $location, Global, Questions, Visualizations) {
        $scope.global = Global;

        $scope.findOne = function() {
            Questions.get({
                questionId: $routeParams.questionId
            }, function(question) {
                $scope.question = question;

                $scope.nominatedButtonActive = $scope.question.nominatedBy.indexOf($scope.global.user._id) !== -1;

                $scope.visualization =  Visualizations.createVisualization(question);
            });
        };

        $scope.nominate = function() {
            var question = $scope.question;

            $scope.nominatedButtonActive = !$scope.nominatedButtonActive;

            question.isNominated = $scope.nominatedButtonActive;

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