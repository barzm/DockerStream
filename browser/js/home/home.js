app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl', 
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser();
        	}
        }
    });
});

app.controller('HomeCtrl', function ($scope, AuthService, user) {
	$scope.user = user;
	$scope.gitLogin = function () {
		AuthService.gitLogin();
	};
});