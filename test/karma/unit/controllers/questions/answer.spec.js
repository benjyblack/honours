(function() {
	'use strict';

	describe('QuestionsAnswerController', function() {
		var scope,
			$routeParams,
			$location,
			$q,
			QuestionsAnswerController,
			MockGlobal,
			MockAnswers,
			MockQuestions,
			currentUserId, questionCreatorId, questionId, answerId,
			sampleQuestion, sampleAnswer, deferredQuestion, deferredAnswer;

		beforeEach(function() {
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

		beforeEach(module('mean'));

		beforeEach(inject(function($rootScope, _$location_, _$routeParams_, _$q_) {
			scope = $rootScope.$new();

			$routeParams = _$routeParams_;
			$location = _$location_;
			$q = _$q_;

			currentUserId = 'basdaskuhow78asd68';
			questionCreatorId = 'a5wa6sad6ad878ds2wqw';
			questionId = '525a8422f6d0f87f0e407a33';
			answerId = '34253sfsdf4524r23easd';

			$routeParams.questionId = questionId;

			sampleQuestion = {
				content: 'This is a professor question',
				type: 'text',
				nominatedBy: [],
				user: {
					type: 'professor',
					_id : questionCreatorId
				},
				answers: [
					{
						_id: answerId
					}
				],
				_id: questionId
			};

			sampleAnswer = {
				content: 'This is an answer',
				user: { _id : currentUserId },
				question: { _id : questionId }
			};


			deferredQuestion = $q.defer();
			deferredAnswer = $q.defer();

			MockGlobal = {
				user : {
					_id : currentUserId
				}
			};

			MockQuestions = {
				get: jasmine.createSpy('MockQuestions: get()').andReturn(deferredQuestion.promise)
			};

			MockAnswers = {
				create: jasmine.createSpy('MockAnswers: create()').andReturn({question: {}}),
				get: jasmine.createSpy('MockAnswers: get()').andReturn(deferredAnswer.promise),
				update: jasmine.createSpy('MockAnswers: update()').andCallFake(function(answer, callback) { callback(sampleAnswer); }),
				save: jasmine.createSpy('MockAnswers: save()').andCallFake(function(answer, callback) { callback(sampleAnswer); })
			};
		}));

		it('should set the scope.answer to be the returned Answer when it already exists',
			inject(function($controller) {

				// Resolve promises successfully
				deferredQuestion.resolve(sampleQuestion);
				deferredAnswer.resolve(sampleAnswer);

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions,
					Answers: MockAnswers
				});

				scope.$apply();

				expect(scope.answer).toEqualData({
					content: 'This is an answer',
					user: { _id : scope.global.user._id },
					question: { _id : $routeParams.questionId }
				});
			})
		);

		it('MockAnswers.create should be called when Answers promise is rejected and the returned Answer should be given the proper Question and User ID',
			inject(function($controller) {

				deferredQuestion.resolve(sampleQuestion);
				deferredAnswer.reject('Answer doesn\'t exist');

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions,
					Answers: MockAnswers
				});

				scope.$apply();

				expect(MockAnswers.create).toHaveBeenCalled();
				expect(scope.answer.question).toBe(sampleQuestion._id);
				expect(scope.answer.user).toBe(currentUserId);
			})
		);

		it('MockAnswers.update should be called when scope.answer has ID and scope.submit is called',
			inject(function($controller) {

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions,
					Answers: MockAnswers
				});

				scope.answer = { _id: answerId };

				scope.submit();

				expect(MockAnswers.update).toHaveBeenCalled();
				expect($location.path()).toBe('/questions/' + questionId);
			})
		);

		it('MockAnswers.save should be called when scope.answer has no ID and scope.submit is called',
			inject(function($controller) {

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions,
					Answers: MockAnswers
				});

				scope.answer = {};

				scope.submit();

				expect(MockAnswers.save).toHaveBeenCalled();
				expect($location.path()).toBe('/questions/' + questionId);
			})
		);
	});
})();