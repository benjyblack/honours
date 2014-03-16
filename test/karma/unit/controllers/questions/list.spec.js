(function() {
    'use strict';

    // QuestionsListController Spec
    describe('QuestionsListController', function() {
        var scope,
            $q,
            MockQuestions,
            QuestionsListController;

        beforeEach(function() {
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        // Load the controllers module
        beforeEach(module('mean'));

        beforeEach(inject(function($controller, $rootScope, _$q_) {
            scope = $rootScope.$new();
            $q = _$q_;

            var deferred = $q.defer();
            deferred.resolve([
                {
                    content: 'This is a professor question',
                    type: 'text',
                    user: {
                        type: 'professor'
                    }
                },
                {
                    content: 'This is a student question',
                    type: 'text',
                    user: {
                        type: 'student'
                    }
                }
            ]);

            MockQuestions = {
                getAll: jasmine.createSpy('mock: getAll()').andReturn(deferred.promise)
            };

            QuestionsListController = $controller('QuestionsListController', {
                $scope: scope,
                Questions: MockQuestions
            });
        }));

        it('should fetch array of student questions fetched from Questions service when type = student', function() {

            // get only student questions
            scope.type = 'student';

            // resolve promise
            scope.$apply();

            // test scope value
            expect(scope.questions).toEqualData([{
                content: 'This is a student question',
                type: 'text',
                user: {
                    type: 'student'
                }
            }]);
        });

        it('should fetch array of professor questions fetched from Questions service when type = professor', function() {

            // get only professor questions
            scope.type = 'professor';

            // resolve promise
            scope.$apply();

            // test scope value
            expect(scope.questions).toEqualData([{
                content: 'This is a professor question',
                type: 'text',
                user: {
                    type: 'professor'
                }
            }]);
        });
    });
})();