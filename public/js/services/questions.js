'use strict';

//Questions service used for questions REST endpoint
angular.module('mean.questions').factory('QuestionsResource',
    ['$resource',
    function($resource) {
        return $resource('questions/:questionId', {
            questionId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('mean.questions').factory('AnswersResource',
    ['$resource',
    function($resource) {
        return $resource('questions/:questionId/answers/:answerId', {
            questionId: '@question._id',
            answerId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('mean.questions').factory('Questions',
    ['$q', 'QuestionsResource', 'AnswersResource',
    function($q, QuestionsResource, AnswersResource) {
        return {
            create: function() {
                return new QuestionsResource({ type: 'text' });
            },
            get: function(id) {
                var deferred = $q.defer();

                QuestionsResource
                    .get({
                        questionId: id
                    }, function(question) {
                        deferred.resolve(question);
                    }, function() {
                        deferred.reject('Question does not exist');
                    });

                return deferred.promise;
            },
            getAll: function() {
                var deferred = $q.defer();

                QuestionsResource.query(function(questions) {
                    deferred.resolve(questions);
                });

                return deferred.promise;
            },
            update: function(question, callback) {
                question.$update(callback);
            },
            save: function(question, callback) {
                question.$save(callback);
            },
            delete: function(question, callback) {
                question.$delete(callback);
            },
            Answers: {
                create: function() {
                    return new AnswersResource();
                },
                get: function(questionId, answerId) {
                    var deferred = $q.defer();

                    AnswersResource
                        .get({
                            questionId: questionId,
                            answerId: answerId
                        }, function(answer) {
                            deferred.resolve(answer);
                        }, function() {
                            deferred.reject('Answer does not exist');
                        });

                    return deferred.promise;
                },
                update: function(answer, questionId, callback) {
                    var answerId = answer._id;

                    AnswersResource
                        .update({
                            questionId: questionId,
                            answerId: answerId
                        }, answer,
                        function(answer) {
                            callback(answer);
                        });
                },
                save: function(answer, callback) {
                    answer.$save(callback);
                }
            }
        };
    }
]);