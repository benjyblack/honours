angular.module('mean.user').controller('UserPasswordController', ['$scope', '$routeParams', '$location', 'Global', function ($scope, $routeParams, $location, Global) {
	$scope.global = Global;

	$scope.currentPassword = '';
	$scope.newPassword = '';
	$scope.retypeNewPassword = '';

	$scope.canSubmit = function() {
		
		if ($scope.currentPassword.length === 0) return false;
		if ($scope.newPassword.length === 0) return false;
		if ($scope.retypeNewPassword.length === 0) return false;

		// New password must match
		if ($scope.newPassword !== $scope.retypeNewPassword) return false;

		// New password must follow password rules
		var pattern = new RegExp('^([a-zA-Z0-9@*#!$]{8,15})$');
		if (!pattern.test($scope.newPassword)) return false;

		return true;
	};
}]);