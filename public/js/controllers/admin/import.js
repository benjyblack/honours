angular.module('mean.admin').controller('AdminImportController', ['$scope', '$routeParams', 'Global', '$location', '$fileUploader', function ($scope, $routeParams, Global, $location, $fileUploader) {

    $scope.message = "";

    // create a uploader with options
    var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,
        url: 'admin/import'
    });

    // REGISTER HANDLERS

    uploader.bind('afteraddingfile', function (event, item) {
        item.upload();
    });

    uploader.bind('complete', function (event, xhr, item, response) {
        console.info('Complete', xhr, item, response);

        if (xhr.status === 201) $scope.message = 'Successfully added ' + response.numSuccess + ' users!';
        else $scope.message = 'Added ' + response.numSuccess + ' users, failed to add ' + response.numFailure + ' others';
    });
}]);