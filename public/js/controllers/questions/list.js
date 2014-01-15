angular.module('mean.questions').controller('QuestionsListController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;

    $scope.find = function() {
        Questions.query(function(questions) {
            $scope.questions = questions;
        });
    };
}]);