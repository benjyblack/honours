angular.module('mean.questions').controller('QuestionsCreateController', ['$scope', '$routeParams', '$location', 'Global', 'Questions', function ($scope, $routeParams, $location, Global, Questions) {
    $scope.global = Global;

    $scope.type = 'text';
    $scope.correctanswer = 'Two';
    $scope.possibleanswers = [
        { content: 'One' },
        { content: 'Two' }
    ];

    $scope.create = function() {
        var question = new Questions({
            content: this.content,
            type: this.type,
            correctanswer: this.correctanswer,
            possibleanswers: this.possibleanswers
        });
        question.$save(function(response) {
            $location.path('questions/' + response._id);
        });

        this.content = '';
    };

    $scope.addChoice = function() {
        this.possibleanswers.push({ content: '' });
    };

    $scope.removeChoice = function(possibleanswer) {
        for (var i = 0, ii = this.possibleanswers.length; i < ii; i++) {
            if (possibleanswer === this.possibleanswers[i]) {
                this.possibleanswers.splice(i, 1);
            }
        }
    };
}]);