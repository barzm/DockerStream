app.config(function($stateProvider) {

    $stateProvider.state('search', {
        url: '/search/:input',
        templateUrl: 'js/search/search.html',
        controller: 'SearchCtrl'
    });

});

app.controller('SearchCtrl', function($scope, Search, Pipeline, AuthService, User, $stateParams, $mdToast, $animate) {
    $scope.input = null;
    $scope.results = null;
    $scope.selectedPipeline = null;
    $scope.userPipelines = null;
    $scope.validRepo = null;
    $scope.toastPosition = {
        bottom: true,
        right: true
    };


    AuthService.getLoggedInUser().then(function(user) {
        $scope.user = user;
        if (!$stateParams.input)
            $scope.getMyRepos();
        else
            $scope.input = $stateParams.input;
        $scope.search();
    });

    (function() {
        User.get()
            .then(function(user) {
                $scope.userPipelines = user.pipelines;
            })
    })()

    $scope.search = function() {
        Search.repositories($scope.input)
            .then(function(response) {
                $scope.results = response;
            })
    }

    $scope.getMyRepos = function() {
        Search.myRepositories($scope.user.github.username)
            .then(function(response) {
                $scope.results = response;
            })
    };

    $scope.addToPipeline = function(pipeline, repo) {
        $scope.validRepo = null;
        $scope.selectedPipeline = repo.full_name;
        Pipeline.add({
                id: pipeline,
                repo: repo
            })
            .then(function(response) {
                $scope.validRepo = 'valid';
            }, function(err) {
                $scope.validRepo = 'invalid';
                console.log('response from error', err)
            });
    };

});