angular.module('mean.questions').controller('QuestionsDetailController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', 'Charts', 'WordClouds', function ($scope, $routeParams, $location, Global, Questions, Charts, WordClouds) {
    $scope.global = Global;

    $scope.findOne = function() {
        Questions.get({
            questionId: $routeParams.questionId
        }, function(question) {
            $scope.question = question;

            if (question.type === 'truefalse')
            {
                $scope.visualizationType =  "chart";
                $scope.visualization = Charts.createTrueFalseChart(question);
            }
            else if (question.type === 'multiplechoice')
            {
                $scope.visualizationType =  "chart";
                $scope.visualization = Charts.createMultipleChoiceChart(question);
            }
            else if (question.type === 'text')
            {
                $scope.visualizationType =  "cloud";
                $scope.visualization = WordClouds.createCloud(question);
                $scope.visualization.start();
            }
        });
    };

    $scope.delete = function() {
        var question = $scope.question;

        question.$delete(function() {
            $location.path('questions/');
        });
    };

}]);