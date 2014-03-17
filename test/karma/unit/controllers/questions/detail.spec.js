(function() {
	'use strict';

	// QuestionsDetailController
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
				get: jasmine.createSpy('mock: get()').andReturn(deferred.promise),
				update: jasmine.createSpy('mock: update()'),
				delete: jasmine.createSpy('mock: delete()').andCallFake(function (question, callback) { callback() })
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

		it('should return a single question object fetched from Questions service', function() {
				
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

		it('$scope.isNominatedByMe() should return true if already nominated by User', function(){
			scope.question = {
				_id: '525a8422f6d0f87f0e407a33',
				nominatedBy: ['a5wa6sad6ad878ds2wqw']
			};

			expect(scope.isNominatedByMe()).toBe(true);
		});

		it('$scope.nominate() should add nomination if not nominated previously to Question and update', function(){
			scope.question = {
				_id: '525a8422f6d0f87f0e407a33',
				nominatedBy: []
			};

			scope.nominate();

			expect(scope.question.nominatedBy).toEqual(['a5wa6sad6ad878ds2wqw']);

			expect(MockQuestions.update).toHaveBeenCalledWith(scope.question);
		});

		it('$scope.nominate() should remove nomination if nominated previously from Question and update', function(){
			scope.question = {
				_id: '525a8422f6d0f87f0e407a33',
				nominatedBy: ['a5wa6sad6ad878ds2wqw']
			};

			scope.nominate();

			expect(scope.question.nominatedBy).toEqual([]);

			expect(MockQuestions.update).toHaveBeenCalledWith(scope.question);
		});

		it('$scope.delete() should send delete a question using the Questions service' +
			'and change the location to the questions list', function() {

				scope.question = {
					_id: '525a8422f6d0f87f0e407a33'
				};

				scope.delete();
				expect(MockQuestions.delete).toHaveBeenCalled();

				//  test after successful delete URL location questions list
				expect($location.path()).toBe('/questions');
			});
	});
})();