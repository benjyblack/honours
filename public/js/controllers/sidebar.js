angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.isCollapsed = false;
}]);