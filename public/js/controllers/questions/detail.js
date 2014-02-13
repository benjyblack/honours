angular.module('mean.questions').controller('QuestionsDetailController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Visualizations', function ($scope, $routeParams, $location, Global, Questions, Visualizations) {
    $scope.global = Global;

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;

            if (question.type === 'multiplechoice' || question.type === 'truefalse')
                $scope.visualizationType = 'chart';
            else
                $scope.visualizationType = 'cloud';
  
            $scope.visualization =  Visualizations.createVisualization(question);
        });
    };

    $scope.delete = function() {
        var question = $scope.question;

        question.$delete(function() {
            $location.path('questions/');
        });
    };
}]);