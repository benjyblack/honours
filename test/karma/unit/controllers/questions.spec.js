(function() {
    'use strict';

    // Questions Controller Spec
    describe('Question controllers', function() {
        var scope,
            $httpBackend,
            $routeParams,
            $location,
            $controllerConstructor,
            mockChart,
            mockWordCloud;

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

        beforeEach(inject(function($controller, $rootScope, _$location_, _$routeParams_, _$httpBackend_) {
            scope = $rootScope.$new();

            $routeParams = _$routeParams_;

            $httpBackend = _$httpBackend_;

            $location = _$location_;

            $controllerConstructor = $controller;

            mockChart = { 
                createTrueFalseChart: jasmine.createSpy('createTrueFalseChart'), 
                createMultipleChoiceChart: jasmine.createSpy('createMultipleChoiceChart') 
            };
            mockWordCloud = { createCloud: jasmine.createSpy(), start: jasmine.createSpy() };
        }));

        describe('QuestionsListController', function() {
            var QuestionsListController;

            beforeEach(inject(function($controller) {
                // Initialize the controller
                QuestionsListController = $controllerConstructor('QuestionsListController', {
                    $scope: scope
                });
            }));

            it('$scope.find() should create an array with at least one question object ' +
                'fetched from XHR', function() {

                    // test expected GET request
                    $httpBackend.expectGET('questions').respond([{
                        title: 'A question about MEAN',
                        content: 'MEAN rocks!'
                    }]);

                    // run controller
                    scope.find();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.questions).toEqualData([{
                        title: 'A question about MEAN',
                        content: 'MEAN rocks!'
                    }]);

                });
        });

        describe('QuestionsDetailController', function() {

            // Initialize the controller
            var QuestionsDetailController;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller) {
                QuestionsDetailController = $controller('QuestionsDetailController', {
                    $scope: scope,
                    Charts: mockChart,
                    WordClouds: mockWordCloud
                });

            }));

            it('$scope.findOne() should create an array with one question object fetched ' +
                'from XHR using a questionId URL parameter', function() {
                    // fixture URL parament
                    $routeParams.questionId = '525a8422f6d0f87f0e407a33';

                    // fixture response object
                    var testQuestionData = function() {
                        return {
                            title: 'A question about MEAN',
                            content: 'MEAN rocks!',
                            type: 'truefalse'
                        };
                    };

                    // test expected GET request with response object
                    $httpBackend.expectGET(/questions\/([0-9a-fA-F]{24})$/).respond(testQuestionData());

                    // run controller
                    scope.findOne();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.question).toEqualData(testQuestionData());
            });
            
            it('$scope.addVisualization() should call the proper methods', function() {
                scope.question = {
                            title: 'Hey, what\'s up?',
                            content: 'MEAN rocks!',
                            type: 'truefalse'
                        };

                scope.addVisualization();

                expect(mockChart.createTrueFalseChart).toHaveBeenCalled();
            });
        });
            // it('$scope.findOne() should create an array with one question object fetched ' +
            //     'from XHR using a questionId URL parameter', function() {
            //         // fixture URL parament
            //         $routeParams.questionId = '525a8422f6d0f87f0e407a33';

            //         // fixture response object
            //         var testQuestionData = function() {
            //             return {
            //                 title: 'An Article about MEAN',
            //                 content: 'MEAN rocks!'
            //             };
            //         };

            //         // test expected GET request with response object
            //         $httpBackend.expectGET(/questions\/([0-9a-fA-F]{24})$/).respond(testQuestionData());

            //         // run controller
            //         scope.findOne();
            //         $httpBackend.flush();

            //         // test scope value
            //         expect(scope.question).toEqualData(testQuestionData());

            //     });

            // it('$scope.create() with valid form data should send a POST request ' +
            //     'with the form input values and then ' +
            //     'locate to new object URL', function() {

            //         // fixture expected POST data
            //         var postQuestionData = function() {
            //             return {
            //                 title: 'An Article about MEAN',
            //                 content: 'MEAN rocks!'
            //             };
            //         };

            //         // fixture expected response data
            //         var respondQuestionData = function() {
            //             return {
            //                 _id: '525cf20451979dea2c000001',
            //                 title: 'An Article about MEAN',
            //                 content: 'MEAN rocks!'
            //             };
            //         };

            //         // fixture mock form input values
            //         scope.title = 'An Article about MEAN';
            //         scope.content = 'MEAN rocks!';

            //         // test post request is sent
            //         $httpBackend.expectPOST('questions', postQuestionData()).respond(respondQuestionData());

            //         // Run controller
            //         scope.create();
            //         $httpBackend.flush();

            //         // test form input(s) are reset
            //         expect(scope.title).toEqual('');
            //         expect(scope.content).toEqual('');

            //         // test URL location to new object
            //         expect($location.path()).toBe('/questions/' + respondQuestionData()._id);
            //     });

            // it('$scope.update() should update a valid article', inject(function(Questions) {

            //     // fixture rideshare
            //     var putArticleData = function() {
            //         return {
            //             _id: '525a8422f6d0f87f0e407a33',
            //             title: 'An Article about MEAN',
            //             to: 'MEAN is great!'
            //         };
            //     };

            //     // mock article object from form
            //     var question = new Questions(putQuestionData());

            //     // mock article in scope
            //     scope.question = question;

            //     // test PUT happens correctly
            //     $httpBackend.expectPUT(/questions\/([0-9a-fA-F]{24})$/).respond();

            //     // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
            //     //$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/, putArticleData()).respond();
            //     /*
            //     Error: Expected PUT /articles\/([0-9a-fA-F]{24})$/ with different data
            //     EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!"}
            //     GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!","updated":[1383534772975]}
            //     */

            //     // run controller
            //     scope.update();
            //     $httpBackend.flush();

            //     // test URL location to new object
            //     expect($location.path()).toBe('/questions/' + putArticleData()._id);

            // }));

            // it('$scope.remove() should send a DELETE request with a valid articleId' +
            //     'and remove the article from the scope', inject(function(Articles) {

            //         // fixture rideshare
            //         var question = new Questions({
            //             _id: '525a8422f6d0f87f0e407a33'
            //         });

            //         // mock rideshares in scope
            //         scope.questions = [];
            //         scope.questions.push(question);

            //         // test expected rideshare DELETE request
            //         $httpBackend.expectDELETE(/questions\/([0-9a-fA-F]{24})$/).respond(204);

            //         // run controller
            //         scope.remove(question);
            //         $httpBackend.flush();

            //         // test after successful delete URL location articles lis
            //         //expect($location.path()).toBe('/articles');
            //         expect(scope.questions.length).toBe(0);

            //     }));
    });
}());