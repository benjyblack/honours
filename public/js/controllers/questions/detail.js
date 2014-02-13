angular.module('mean.questions').controller('QuestionsDetailController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Charts', 'WordClouds', function ($scope, $routeParams, $location, Global, Questions, Charts, WordClouds) {
    $scope.global = Global;

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;

            $scope.addVisualization();
        });
    };

    $scope.delete = function() {
        var question = $scope.question;

        question.$delete(function() {
            $location.path('questions/');
        });
    };

    $scope.addVisualization = function() {
        if ($scope.question.type === 'truefalse')
        {
            $scope.visualizationType =  "chart";
            $scope.visualization = Charts.createTrueFalseChart($scope.question);
        }
        else if ($scope.question.type === 'multiplechoice')
        {
            $scope.visualizationType =  "chart";
            $scope.visualization = Charts.createMultipleChoiceChart($scope.question);
        }
        else if ($scope.question.type === 'text')
        {
            $scope.visualizationType =  "cloud";
            $scope.visualization = WordClouds.createCloud($scope.question, '#cloud');
            $scope.visualization.start();
        }
    };

}]);