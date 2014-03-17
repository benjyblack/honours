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
                var index = $scope.question.nominatedBy.indexOf($scope.global.user._id);
                $scope.question.nominatedBy.splice(index, 1);
            }
            else {
                $scope.question.nominatedBy.push($scope.global.user._id);
            }

            Questions.update($scope.question);
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