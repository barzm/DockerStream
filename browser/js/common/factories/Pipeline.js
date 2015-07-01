app.factory('Pipeline', function($http) {



	function createPipeline (pName) {
		return $http.post('/api/pipelines', {name: pName})
		.then(function (response) {
			return response.data;
		})
	}

	function getPipelines () {
		return $http.get('/api/pipelines')
		.then(function(response) {
			return response.data;
		})
	}

	function getRepoByUrl (url) {
		url = url.split('com/')[1].split('/');
		var user = url[0], repo = url[1].split('.')[0];
		return $http.get(`/api/pipelines?user=${user}&repo=${repo}`)
		.then(function (response) {
			return response.data;
		})
	}

	function addToPipeline (info) {
		return $http.put('api/pipelines', info)
		.then(function(response) {
			console.log('from adding', response.data)
			return response.data;
		})
	}
	

	function updatePipelines (pipelines) {
		return $http.put('/api/user', pipelines)
		.then(function (response) {
			return response.data;
		})
	}

	function deletePipeline (pipeline) {
		return $http.delete('/api/pipelines/' + pipeline.pipelineId)
		.then(function(response) {
			return response.data;
		})
	}

	return {
		create: createPipeline,
		get: getPipelines,
		getByUrl: getRepoByUrl,
		add: addToPipeline,
		update: updatePipelines,
		delete: deletePipeline
	}
})