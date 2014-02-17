//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/questions', {
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
            controller: 'QuestionsEditController'
        }).
        when('/questions/:questionId', {
            templateUrl: 'views/questions/detail.html',
            controller: 'QuestionsDetailController'
        }).
        when('/', {
            templateUrl: 'views/index.html',
            controller: 'IndexController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
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
                        return;
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }
]);