//Questions service used for questions REST endpoint
angular.module('mean.questions').factory("Questions", ['$resource', function($resource) {
    return $resource('questions/:questionId', {
        questionId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

angular.module('mean.questions').factory("QuestionsInit", ['$routeParams', '$q', 'Questions',  function($routeParams, $q, Questions) {
    return {
        init: function(action) {
            var deferred = $q.defer();

            if (action === 'create')
                deferred.resolve(new Questions({ type: 'text' }));
            else {
                Questions.get({
                    questionId: $routeParams.questionId
                }, function(question) {
                    deferred.resolve(question);
                });
            }

            return deferred.promise;
        }
    };
}]);