angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;


    if ($scope.global.authenticated)
    {
        if ($scope.global.user.type === 'Professor')
        {
            $scope.menu = [{
                'title': 'Questions',
                'link': 'questions/'
            }, {
                'title': 'Ask a question',
                'link': 'questions/create'
            }];
        }
        else
        {
            $scope.menu = [{
                'title': 'Questions',
                'link': 'questions/'
            }];
        }
    }
    
    $scope.isCollapsed = false;
}]);