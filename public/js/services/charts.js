'use strict';

angular.module('mean.questions').factory('Charts', function() {
	var chart = {
		'type': 'PieChart',
		'displayed': true,
		'cssStyle': 'height:600px; width:100%;',
		'data': {
			'cols': [
				{
					'id': 'answer',
					'label': 'Answer',
					'type': 'string',
					'p': {}
				},
				{
					'id': 'num-answers',
					'label': 'Number',
					'type': 'number',
					'p': {}
				}
			],
			'rows' : []
		},
		'options': {
			'is3D': true,
			'isStacked': 'true',
			'fill': 20,
			'displayExactValues': true,
			'vAxis': {
				'title': 'Sales unit',
				'gridlines': {
					'count': 10
				}
			},
			'hAxis': {
				'title': 'Date'
			}
		},
		'formatters': {}
	};  

	return {
		createMultipleChoiceChart: function(question) {
			var numEntriesForPossibleAnswer = {};
			var i;
			
			for(i=0; i<question.possibleAnswers.length; i++)
			{
				numEntriesForPossibleAnswer[question.possibleAnswers[i]] = 0;
			}
			for(i=0; i<question.answers.length; i++)
			{
				numEntriesForPossibleAnswer[question.answers[i].content]++;
			}

			var rows = [];

			for (var prop in numEntriesForPossibleAnswer)
			{
				rows.push({
					'c': [
						{
							'v': prop
						},
						{
							'v': numEntriesForPossibleAnswer[prop]
						}
					]
				});
			}

			chart.data.rows = rows;

			return chart;
		},


		createTrueFalseChart: function(question) {
			var numTrue = question.answers.filter(function(value) { return value.content === 'true'; }).length;
			var numFalse = question.answers.length - numTrue;

			var rows = [
				{
					'c': [
						{
							'v': 'True'
						},
						{
							'v': numTrue
						}
					]
				},
				{
					'c': [
						{
							'v': 'False'
						},
						{
							'v': numFalse
						}
					]
				}
			];

			chart.data.rows = rows;

			return chart;
		}
	};
});