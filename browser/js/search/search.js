app.config(function ($stateProvider) {

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'js/search/search.html',
        controller: 'SearchCtrl'
    });

});

app.controller('SearchCtrl', function ($scope, Search, Pipeline, AuthService) {

    $scope.input = null;
    $scope.results = null;
    AuthService.getLoggedInUser().then(function(user) {
        $scope.user = user;
        $scope.getMyRepos();
    })

    $scope.search = function () {
        console.log('hello');
        Search.repositories($scope.input)
        .then(function (response) {
            $scope.results = response;
            console.log($scope.results);
        })
    }

    $scope.getMyRepos = function() {
        Search.myRepositories($scope.user.github.username)
        .then(function(response) {
            $scope.results = response;
        })
    };
    
    $scope.addToPipeline = function(result) {
        console.log(result);
        Pipeline.add(result);
        console.log(Pipeline);
    };

});