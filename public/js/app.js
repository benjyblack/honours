angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.admin', 'mean.questions']);

angular.module('mean.system', []);
angular.module('mean.admin', ['angularFileUpload']);
angular.module('mean.questions', ['googlechart']);