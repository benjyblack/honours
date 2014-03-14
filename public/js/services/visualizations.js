'use strict';

angular.module('mean.questions').factory('Visualizations',
	['WordClouds', 'Charts',
	function(WordClouds, Charts) {
		return {
			createVisualization: function(question) {
				if (question.type === 'truefalse')
					return {
						type: 'chart',
						content: Charts.createTrueFalseChart(question)
					};
				else if (question.type === 'multiplechoice')
					return {
						type: 'chart',
						content: Charts.createMultipleChoiceChart(question)
					};
				else if (question.type === 'text')
				{
					var visualization = WordClouds.createCloud(question, '#cloud');
					visualization.start();

					return {
						type: 'cloud',
						content: visualization
					};
				}
			}
		};
	}
]);
