(function() {
	'use strict';

	describe('QuestionsAnswerController', function() {
		var scope,
			$routeParams,
			$location,
			$q,
			QuestionsAnswerController,
			MockGlobal,
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

			sampleAnswer = {
				content: 'This is an answer',
				user: { _id : currentUserId },
			};

			sampleQuestion = {
				content: 'This is a professor question',
				type: 'text',
				nominatedBy: [],
				user: {
					type: 'professor',
					_id : questionCreatorId
				},
				answers: [sampleAnswer],
				_id: questionId
			};

			deferredQuestion = $q.defer();
			deferredAnswer = $q.defer();

			MockGlobal = {
				user : {
					_id : currentUserId
				}
			};

			MockQuestions = {
				get: jasmine.createSpy('MockQuestions: get()').andReturn(deferredQuestion.promise),
				Answers: {
					create: jasmine.createSpy('MockQuestions.Answers: create()').andReturn({}),
					get: jasmine.createSpy('MockQuestions.Answers: get()').andReturn(deferredAnswer.promise),
					update: jasmine.createSpy('MockQuestions.Answers: update()').andCallFake(function(questionId, answerId, answer, callback) { callback(sampleQuestion); }),
					save: jasmine.createSpy('MockQuestions.Answers: save()').andCallFake(function(questionId, answer, callback) { callback(sampleQuestion); }),
					delete: jasmine.createSpy('MockQuestions.Answers: delete()').andCallFake(function(questionId, answerId, callback) { callback(sampleQuestion); })
				}
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
					Questions: MockQuestions
				});

				scope.$apply();

				expect(MockQuestions.get).toHaveBeenCalledWith(scope.question._id);
				expect(MockQuestions.Answers.get).toHaveBeenCalledWith(scope.question._id, scope.question.answers[0]._id);
				expect(scope.answer).toEqualData({
					content: 'This is an answer',
					user: { _id : scope.global.user._id }
				});
			})
		);

		it('MockQuestions.Answers.create should be called on Controller initialization',
			inject(function($controller) {

				deferredQuestion.resolve(sampleQuestion);

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions
				});

				scope.$apply();

				expect(MockQuestions.Answers.create).toHaveBeenCalled();
			})
		);

		it('MockQuestions.Answers.update should be called when scope.answer has ID and scope.submit is called',
			inject(function($controller) {

				deferredQuestion.resolve(sampleQuestion);

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions
				});

				scope.$apply();

				scope.answer = { _id: answerId };

				scope.submit();

				expect(MockQuestions.Answers.update)
					.toHaveBeenCalledWith(scope.question._id, scope.answer._id, scope.answer, jasmine.any(Function));
				expect($location.path()).toBe('/questions/' + scope.question._id);
			})
		);

		it('MockQuestions.Answers.save should be called when scope.answer has no ID and scope.submit is called',
			inject(function($controller) {

				deferredQuestion.resolve(sampleQuestion);

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions
				});

				scope.$apply();

				scope.answer = {};

				scope.submit();

				expect(MockQuestions.Answers.save)
					.toHaveBeenCalledWith(scope.question._id, scope.answer, jasmine.any(Function));
				expect($location.path()).toBe('/questions/' + scope.question._id);
			})
		);

		it('MockQuestions.Answers.delete should be called with Question and Answer ID and should redirect to Question',
			inject(function($controller) {

				deferredQuestion.resolve(sampleQuestion);
				deferredQuestion.resolve(sampleAnswer);

				QuestionsAnswerController = $controller('QuestionsAnswerController', {
					$scope: scope,
					Global: MockGlobal,
					Questions: MockQuestions
				});

				scope.$apply();

				scope.delete();

				expect(MockQuestions.Answers.delete).toHaveBeenCalledWith(scope.question._id, scope.answer._id, jasmine.any(Function));
				expect($location.path()).toBe('/questions/' + scope.question._id);
			})
		);
	});
})();