angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.admin', 'mean.user', 'mean.questions']);

angular.module('mean.system', []);
angular.module('mean.admin', ['angularFileUpload']);
angular.module('mean.user', []);
angular.module('mean.questions', ['googlechart']);