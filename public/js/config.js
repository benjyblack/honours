'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/index.html'
        }).
        when('/user/profile', {
            templateUrl: 'views/user/profile.html',
            controller: 'UserProfileController'
        }).
        when('/user/password', {
            templateUrl: 'views/user/password.html',
            controller: 'UserPasswordController'
        }).
        when('/questions/list/:type', {
            templateUrl: 'views/questions/list.html',
            controller: 'QuestionsListController'
        }).
        when('/questions/create', {
            templateUrl: 'views/questions/edit.html',
            controller: 'QuestionsEditController'
        }).
        when('/questions/:questionId/edit', {
            templateUrl: 'views/questions/edit.html',
            controller: 'QuestionsEditController'
        }).
        when('/questions/:questionId/answer', {
            templateUrl: 'views/questions/answer.html',
            controller: 'QuestionsAnswerController'
        }).
        when('/questions/:questionId', {
            templateUrl: 'views/questions/detail.html',
            controller: 'QuestionsDetailController'
        }).
        when('/admin/userlist', {
            templateUrl: 'views/admin/userlist.html',
            controller: 'AdminUserListController'
        }).
        when('/admin/create-user', {
            templateUrl: 'views/admin/create-user.html',
            controller: 'AdminCreateUserController'
        }).
        when('/admin/import', {
            templateUrl: 'views/admin/import.html',
            controller: 'AdminImportController'
        }).
        when('/admin/controls', {
            templateUrl: 'views/admin/controls.html',
            controller: 'AdminControlsController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

angular.module('mean').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push(function($q) {
            return {
                'responseError': function(rejection) {
                    var status = rejection.status;

                    if (status == 401) {
                        window.location = './signin';
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }
]);


//Enforce client-side authentication
angular.module('mean').run(['$rootScope', '$location', 'Global',
    function($rootScope, $location, Global) {
        $rootScope.$on('$routeChangeStart',
            function () {
                if (!Global.authenticated) {
                    window.location = '/signin';
                }
            }
        );
    }
]);