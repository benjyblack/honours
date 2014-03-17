'use strict';

//Answers service used for questions REST endpoint
angular.module('mean.questions').factory('AnswersResource',
    ['$resource',
    function($resource) {
        return $resource('answers/:answerId', {
            answerId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('mean.questions').factory('Answers',
    ['$q', 'AnswersResource',
    function($q, AnswersResource) {
        return {
            create: function() {
                return new AnswersResource({});
            },
            get: function(query) {
                var deferred = $q.defer();

                AnswersResource
                .get(query, 
                    function(answer) {
                        deferred.resolve(answer);
                    },
                    function(error) {
                        deferred.reject('Answer does not exist');
                    }
                );

                return deferred.promise;
            },
            getAll: function() {
                var deferred = $q.defer();

                AnswersResource.query(function(answers) {
                    deferred.resolve(answers);
                });

                return deferred.promise;
            },
            update: function(answer, callback) {
                answer.$update(callback);
            },
            save: function(answer, callback) {
                answer.$save(callback);
            },
            delete: function(answer, callback) {
                answer.$delete(callback);
            }
        };
    }
]);