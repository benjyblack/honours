(function() {
    'use strict';

    // Questions Controller Spec
    describe('QuestionsListController', function() {
        var scope,
            $httpBackend,
            $routeParams,
            $location,
            $q,
            QuestionsListController;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        // Load the controllers module
        beforeEach(module('mean'));

        beforeEach(inject(function($controller, $rootScope, _$location_, _$routeParams_, _$httpBackend_, _$q_) {
            scope = $rootScope.$new();

            $routeParams = _$routeParams_;

            $httpBackend = _$httpBackend_;

            $location = _$location_;

            $q = _$q_;

            QuestionsListController = $controller('QuestionsListController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one question object ' +
            'fetched from XHR', function() {

                // test expected GET request
                $httpBackend.expectGET('questions').respond([{
                    content: 'Why are you asking me this?',
                    type: 'text'
                }]);

                // run controller
                scope.find();
                $httpBackend.flush();

                // test scope value
                expect(scope.questions).toEqualData([{
                    content: 'Why are you asking me this?',
                    type: 'text'
                }]);

        });
    });
});