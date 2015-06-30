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
	$scope.models = {};
    	$scope.loc = window.location.host;
    	$scope.saved = 'untouched';
    	$scope.demo = {
        topDirections: ['left', 'up'],
        bottomDirections: ['down', 'right'],

        isOpen: false,
        selectedMode: 'md-fling',
        selectedDirection: 'right'
     }
    	$scope.getUrl = function (id) {
    		return `https://${$scope.loc}/run/?id=${id}`;
    	};

	$scope.createPipeline = function() {
		if (!$scope.pipelineName) return;
		Pipeline.create($scope.pipelineName)
		.then(function(response) {
			$scope.created = true;
			$scope.pipelineName = '';
			$scope.models.list = makePipelineModel(response);
		});
	};

	$scope.getPipelines = function() {
		Pipeline.get()
		.then(function(response) {
			var obj = makePipelineModel(response);
			$scope.models = {
				selected: null,
				list: obj
			}
		})
	};

	$scope.updatePipelines = function () {
		Pipeline.update($scope.models.list)
		.then(function (response) {
			$scope.saved = 'saved';
		})
	};

	$scope.reorder = function() {
		for (var pipelineObj in $scope.models.list) {
			$scope.models.list[pipelineObj].pipeline
			.map(function(repo, ix) {
				console.log(repo, ix);
				repo.order = ix;
			})
		}
		$scope.saved = 'unsaved';
	};

	$scope.deleteRepo = function(pipeline, ix) {
		$scope.models.list[pipeline.name].pipeline.splice(ix, 1);
		$scope.reorder();
		$scope.updatePipelines();
	};

	$scope.deletePipeline = function(pipeline) {
		Pipeline.delete(pipeline)
		.then(function() {
			delete $scope.models.list[pipeline.name];
		})
	};

	function makePipelineModel(data) {
		var obj = {};
		data.pipelines.forEach(function(pipeline) {
			obj[pipeline.name] = {
				pipelineId: pipeline._id,
				name: pipeline.name,
				pipeline: pipeline.pipeline
			}
		})
		return obj;
	};

	$scope.getPipelines();
});