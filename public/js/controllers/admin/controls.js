'use strict';

angular.module('mean.admin').controller('AdminControlsController',
	['$scope', '$routeParams', 'Global',
	function ($scope, $routeParams, Global) {
		$scope.global = Global;

		if ($scope.global.authenticated)
		{
			$scope.menu =
				[
					{
						'title': 'View list of Users',
						'link': 'admin/userlist',
						'icon': 'fa-user'
					}, {
						'title': 'Import Students from CSV',
						'link': 'admin/import',
						'icon': 'fa-upload'
					}
				];
		}
	}
]);