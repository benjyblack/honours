(function() {
    'use strict';

    // Questions Controller Spec
    describe('QuestionsDetailController', function() {
        var scope,
            $routeParams,
            $location,
            $q,
            QuestionsDetailController,
            MockGlobal,
            MockVisualizations,
            MockQuestions;

        beforeEach(function() {
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        // Load the controllers module
        beforeEach(module('mean'));

        beforeEach(inject(function($controller, $rootScope, _$location_, _$routeParams_, _$q_) {
            scope = $rootScope.$new();

            $routeParams = _$routeParams_;

            $location = _$location_;

            $q = _$q_;

            // fixture URL parameter
            $routeParams.questionId = '525a8422f6d0f87f0e407a33';

            var deferred = $q.defer();
            deferred.resolve(
                {
                    content: 'This is a professor question',
                    type: 'text',
                    nominatedBy: [],
                    user: {
                        type: 'professor',
                        _id : 'a5wa6sad6ad878ds2wqw'
                    }
                }
            );

            MockGlobal = {
                user : {
                    _id : 'a5wa6sad6ad878ds2wqw'
                }
            };

            MockQuestions = {
                get: jasmine.createSpy('mock: get()').andReturn(deferred.promise)
            };
            
            MockVisualizations = {
                createVisualization: jasmine.createSpy('createTrueFalseChart')
            };

            QuestionsDetailController = $controller('QuestionsDetailController', {
                $scope: scope,
                Global: MockGlobal,
                Questions: MockQuestions,
                Visualizations: MockVisualizations
            });

        }));

        it('should return a single question object fetched from Questions service using a questionId URL parameter', function() {
                
                // resolve promise
                scope.$apply();

                // test service call
                expect(MockQuestions.get).toHaveBeenCalledWith('525a8422f6d0f87f0e407a33');

                // test scope value
                expect(scope.question).toEqualData({
                    content: 'This is a professor question',
                    type: 'text',
                    nominatedBy: [],
                    user: {
                        type: 'professor',
                        _id : 'a5wa6sad6ad878ds2wqw'
                    }
                });
        });

        it('$scope.delete() should send a DELETE request with a valid questionId' +
            'and change the location the questions list', inject(function(Questions) {

                scope.question = new Questions({
                    _id: '525a8422f6d0f87f0e407a33'
                });

                $httpBackend.expectDELETE(/questions\/([0-9a-fA-F]{24})$/).respond(204);

                // run controller
                scope.delete();
                $httpBackend.flush();

                //  test after successful delete URL location questions list
                 expect($location.path()).toBe('/questions');
            }));
    });
})();