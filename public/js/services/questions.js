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

angular.module('mean.questions').factory('Questions',
    ['$q', 'QuestionsResource',
    function($q, Questions) {
        return {
            create: function() {
                return new Questions({ type: 'text' });
            },
            get: function(id) {
                var deferred = $q.defer();

                Questions.get({
                    questionId: id
                }, function(question) {
                    deferred.resolve(question);
                });

                return deferred.promise;
            },
            getAll: function() {
                var deferred = $q.defer();

                Questions.query(function(questions) {
                    deferred.resolve(questions);
                });

                return deferred.promise;
            }
        };
    }
]);