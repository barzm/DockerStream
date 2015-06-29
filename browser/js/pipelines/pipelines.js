app.config(function($stateProvider) {

	$stateProvider.state('pipelines', {
		url: '/pipelines',
		templateUrl: 'js/pipelines/pipelines.html',
		controller: 'PipelinesCtrl'
	});

});

app.controller('PipelinesCtrl', function($scope, Pipeline) {
	$scope.pipelineName = null;
	$scope.created = false;

	$scope.createPipeline = function() {
		Pipeline.create($scope.pipelineName)
	     .then(function(response) {
	     	console.log('response',response);
			$scope.created = response;
		});
	};

});