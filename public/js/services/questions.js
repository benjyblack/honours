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
                update: function(questionId, answerId, answer, callback) {
                    AnswersResource
                        .update({
                            questionId: questionId,
                            answerId: answerId
                        }, answer,
                        function(question) {
                            callback(question);
                        });
                },
                save: function(questionId, answer, callback) {
                    AnswersResource
                        .save({
                            questionId: questionId
                        }, answer,
                        function(question) {
                            callback(question);
                        });
                },
                delete: function(questionId, answerId, callback) {
                    AnswersResource
                        .delete({
                            questionId: questionId,
                            answerId: answerId
                        }, function(question) {
                            callback(question);
                        });
                }
            }
        };
    }
]);