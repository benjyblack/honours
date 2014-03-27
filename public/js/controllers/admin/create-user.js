'use strict';

angular.module('mean.admin').controller('AdminCreateUserController',
    ['$scope', 'Global', '$location', 'Users',
    function ($scope, Global, $location, Users) {
        $scope.global = Global;

        $scope.submit = function() {
			var user = new Users();
			user.email = $scope.email;
			user.firstName = $scope.firstName;
			user.lastName = $scope.lastName;

			user.$save(function(user) {
				$location.path('/admin/controls');
			});
        };

        $scope.canSubmit = function() {
			if (typeof($scope.email) === 'undefined' || $scope.email.length <= 0)
				return false;
			if (typeof($scope.firstName) === 'undefined' || $scope.firstName.length <= 0)
				return false;
			if (typeof($scope.lastName) === 'undefined' || $scope.lastName.length <= 0)
				return false;

			return true;
        };
    }
]);