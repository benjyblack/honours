(function() {
    'use strict';

    // Questions Controller Spec
    describe('Question controllers', function() {
        var scope,
            $httpBackend,
            $routeParams,
            $location,
            $controllerConstructor,
            mockVisualizations;

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

            mockVisualizations = { 
                createVisualization: jasmine.createSpy('createTrueFalseChart') 
            };
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
                    Visualizations: mockVisualizations
                });

            }));

            it('$scope.findOne() should return a single question object fetched ' +
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

        describe('QuestionsCreateController', function() {

            // Initialize the controller
            var QuestionsCreateController;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller) {
                QuestionsCreateController = $controller('QuestionsCreateController', {
                    $scope: scope
                });
            }));

            it('$scope.submit() with valid form data should send a POST request ' +
                'with the form input values and then ' +
                'locate to new object URL', function() {

                    // fixture expected POST data
                    var postQuestionData = function() {
                        return {
                            content: 'Why is the sky blue?',
                            type: 'text',
                            correctanswer: 'because',
                            possibleAnswers: []
                        };
                    };

                    // fixture expected response data
                    var respondQuestionData = function() {
                        return {
                            _id: '525cf20451979dea2c000001',
                            content: 'Why is the sky blue?',
                            type: 'text',
                            correctanswer: 'because',
                            possibleAnswers: []
                        };
                    };

                    // fixture mock form input values
                    scope.question.content = 'Why is the sky blue?';
                    scope.question.type = 'text';
                    scope.question.correctanswer = 'because';
                    scope.question.possibleAnswers = [];

                    // test post request is sent
                    $httpBackend.expectPOST('questions', postQuestionData()).respond(respondQuestionData());

                    // Run controller
                    scope.submit();
                    $httpBackend.flush();

                    // test URL location to new object
                    expect($location.path()).toBe('/questions/' + respondQuestionData()._id);
            });


            it('$scope.addChoice() should add another possible answer', function() {
                var numPossibleAnswersBeforeAdd = scope.question.possibleAnswers.length;

                scope.addChoice();

                expect(scope.question.possibleAnswers.length).toEqual(numPossibleAnswersBeforeAdd + 1);
            });

            it('$scope.removeChoice() should remove a possible answer', function() {
                var exampleAnswer = 'AnswerA';

                scope.question.possibleAnswers = [exampleAnswer];

                scope.removeChoice(0);

                expect(scope.question.possibleAnswers.length).toEqual(0);
            });

            it('$scope.removeChoice() should set the selectedAnswerIndex to 0,' +
                ' if the selected answer was removed', function() {
                var exampleAnswers = [ 'AnswerA', 'AnswerB' ];

                scope.question.possibleAnswers = exampleAnswers;
                scope.selectedAnswer = 1;

                scope.removeChoice(1);

                expect(scope.selectedAnswerIndex).toEqual(0);
            });
        });

        describe('QuestionsEditController', function() {

            // Initialize the controller
            var QuestionsEditController;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller) {
                QuestionsEditController = $controller('QuestionsEditController', {
                    $scope: scope
                });
            }));

            it('$scope.findOne() should return a single question object fetched ' +
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

            it('$scope.addAnswer() should PUT an answer and relocate you', inject(function(Questions) {

                // fixture rideshare
                var putQuestionData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        content:'Which is a fruit?',
                        answers: [{content:'Tomato'}]
                    };
                };

                // mock article object from form
                var question = new Questions(putQuestionData());

                // mock article in scope
                scope.question = question;

                // test PUT happens correctly
                $httpBackend.expectPUT(/questions\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/, putArticleData()).respond();
                /*
                Error: Expected PUT /articles\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!"}
                GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                */

                // run controller
                scope.addAnswer();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/questions/' + putQuestionData()._id);
            }));

            it('$scope.update() should PUT the updated question to the server'), inject(function(Questions){
                // fixture rideshare
                var putQuestionData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        content:'Which is a fruit?',
                        answers: [{content:'Tomato'}]
                    };
                };

                // mock question object from form
                var question = new Questions(putQuestionData());

                // mock question in scope
                scope.question = question;

                // test PUT happens correctly
                $httpBackend.expectPUT(/questions\/([0-9a-fA-F]{24})$/).respond();

                // run controller
                scope.update();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/questions/' + putQuestionData()._id);
            });
        });
            // it('$scope.findOne() should create an array with one question object fetched ' +
            //     'from XHR using a questionId URL parameter', function() {
            //         // fixture URL parament
            //         $routeParams.questionId = '525a8422f6d0f87f0e407a33';

            //         // fixture response object
            //         var testQuestionData = function() {
            //             return {
            //                 title: 'An question about MEAN',
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
    });
}());