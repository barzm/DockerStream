app.config(function($stateProvider) {

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'js/search/search.html',
        controller: 'SearchCtrl'
    });

});

app.controller('SearchCtrl', function($scope, Search, Pipeline, AuthService, User) {

    $scope.input = null;
    $scope.results = null;
    $scope.pipelineSelect = null;
    $scope.userPipelines = null;

    AuthService.getLoggedInUser().then(function(user) {
        $scope.user = user;
        $scope.getMyRepos();
    });

    $scope.pipelines = [{
        name: 'Boolean Aggregator'
    }, {
        name: 'Pied Pipeline'
    }];

    (function(){
        User.get()
        .then(function (user) {
            $scope.userPipelines = user.pipelines;
        })
    }
    )()

    $scope.search = function() {
        console.log('hello');
        Search.repositories($scope.input)
        .then(function(response) {
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

    $scope.addToPipeline = function(repo) {
        console.log(repo);
        Pipeline.create(repo)
        .then(function (response){
            console.log('response from creation', response);
        });
    };

});