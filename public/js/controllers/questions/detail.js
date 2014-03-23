'use strict';

angular.module('mean.questions').controller('QuestionsDetailController',
    ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Visualizations',
    function ($scope, $routeParams, $location, Global, Questions, Visualizations) {
        $scope.global = Global;

        Questions.get($routeParams.questionId).then(function(question) {
            $scope.question = question;
            $scope.visualization =  Visualizations.createVisualization(question);

            $scope.askedByMe = $scope.question.user._id === $scope.global.user._id;
        });

        $scope.nominate = function() {
            if ($scope.isNominatedByMe()) {
                Questions.Nominations.remove($scope.question._id, $scope.global.user._id, function(question) {
                    $scope.question = question;
                });
            }
            else {
                Questions.Nominations.add($scope.question._id, function(question) {
                    $scope.question = question;
                });
            }
        };

        $scope.isNominatedByMe = function() {
            if (typeof($scope.question) === 'undefined') return false;

            return $scope.question.nominatedBy.indexOf($scope.global.user._id) !== -1;
        };

        $scope.delete = function() {
            Questions.delete($scope.question, function() {
                $location.path('questions');
            });
        };
    }
]);