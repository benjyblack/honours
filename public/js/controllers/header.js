angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;


    if ($scope.global.authenticated)
    {
        $scope.menu = [{
            'title': 'Professor\'s Questions',
            'link': 'questions/list/professor'
        }, {
            'title': 'Student\'s Questions',
            'link': 'questions/list/student'
        }, {
            'title': 'Ask a question',
            'link': 'questions/create'
        }];
    }
    
    $scope.isCollapsed = false;
}]);