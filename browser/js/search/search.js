app.config(function ($stateProvider) {

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'js/search/search.html',
        controller: 'SearchCtrl'
    });

});

app.controller('SearchCtrl', function ($scope, Search) {

    $scope.searchInput = null;


    $scope.search = function () {
        Search.repositories($scope.searchInput)
        .then(function (response) {
            console.log(` search response: + ${ response } `);
        })
    }
    

});