app.config(function ($stateProvider) {

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'js/search/search.html',
        controller: 'SearchCtrl'
    });

});

app.controller('SearchCtrl', function ($scope, Search) {

    $scope.input = null;
    $scope.results = null;
    $scope.search = function () {
        console.log('hello');
        Search.repositories($scope.input)
        .then(function (response) {
            $scope.results = response;
            console.log($scope.results);
        })
    }
    

});