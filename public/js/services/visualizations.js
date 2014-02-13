angular.module('mean.questions').factory('Visualizations', ['WordClouds', 'Charts', function(WordClouds, Charts) {
    return {
        createVisualization: function(question) {
            if (question.type === 'truefalse')
            {
                return Charts.createTrueFalseChart(question);
            }
            else if (question.type === 'multiplechoice')
            {
                return Charts.createMultipleChoiceChart(question);
            }
            else if (question.type === 'text')
            {
                var visualization = WordClouds.createCloud(question, '#cloud');
                visualization.start();

                return visualization;
            }
        }
    };
}]);
