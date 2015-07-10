app.config(function($stateProvider) {
	$stateProvider.state('about', {
		url: '/about',
		templateUrl: 'js/about/about.html',
	})
});

app.controller('AboutCtrl', function($scope) {
	
})