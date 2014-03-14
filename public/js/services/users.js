'use strict';

//Users service used for user REST endpoint
angular.module('mean.user').factory('Users',
	['$resource',
	function($resource) {
		return $resource('users/:userId',
			{
				userId: '@_id'
			},
			{
				update:
				{
					method: 'PUT'
				}
			}
		);
	}
]);