angular.module('mean.user').controller('UserPasswordController', ['$scope', '$routeParams', '$location', 'Global', 'Users', function ($scope, $routeParams, $location, Global, Users) {
	$scope.global = Global;

	$scope.currentPassword = '';
	$scope.newPassword = '';
	$scope.retypeNewPassword = '';

	$scope.findOne = function() {
        Users.get({
            userId: $scope.global.user._id
        }, function(user) {
            $scope.user = user;
        });
    }; 

	$scope.canSubmit = function() {
		
		if ($scope.newPassword.length === 0) return false;
		if ($scope.retypeNewPassword.length === 0) return false;

		// New password must match
		if ($scope.newPassword !== $scope.retypeNewPassword) return false;

		// New password must follow password rules
		var pattern = new RegExp('^([a-zA-Z0-9@*#!$]{8,15})$');
		if (!pattern.test($scope.newPassword)) return false;

		return true;
	};

	$scope.submit = function() {

		$scope.user.password = $scope.newPassword;

		$scope.user.$save(function(response) {
            $location.path('user/profile');
        });
	};
}]);