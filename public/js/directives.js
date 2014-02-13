// angular.module('mean.questions').directive('visualization', function($compile) {
// 	return {
// 		restrict: 'E',
// 		scope: true,
// 		link: function(scope, element) {
// 			var markup;
// 			debugger;
// 			if (scope.visualizationType === 'chart')
// 				markup = '<div google-chart chart="visualization" style="{{visualization.cssStyle}}"></div>';
// 			else
// 				markup = '<div id="cloud"></div>';

// 			angular.element(element).html($compile(markup)(scope));
// 		}
// 	};
// });