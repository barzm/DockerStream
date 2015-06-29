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
	$scope.pipelines = [];


	$scope.createPipeline = function() {
		Pipeline.create($scope.pipelineName)
	     .then(function(response) {
			$scope.created = true;
			$scope.pipelineName = '';
			$scope.pipelines = response.pipelines;
		});
	};

	$scope.getPipelines = function() {
		Pipeline.get()
		.then(function(response) {
			$scope.pipelines = response.pipelines;
			console.log($scope.pipelines);
		})
	}

	$scope.getPipelines();
});