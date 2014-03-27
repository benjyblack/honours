'use strict';

angular.module('mean.admin').controller('AdminUserListController',
    ['$scope', 'Global', 'Users',
    function ($scope, Global, Users) {
        $scope.global = Global;

        Users.query(function(users) {
            $scope.users = users;
        });
    }
]);