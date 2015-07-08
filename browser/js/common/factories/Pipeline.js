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
		var url = `${info.repo.url}/contents/`
		return $http.get(`/api/pipelines/validate/?url=${url}`)
		.then(function(response) {
			var files = response.data;
			return files.some(file => file.name === 'Dockerfile')
		})
		.then(function(shouldAdd) {
			if (shouldAdd) {
				return $http.put('api/pipelines', info)
				.then(function(response) {
					console.log(response);
					return response.data;
				})
				.catch(function(err){
					console.log('Err',err);
					return err;
				})
			} else {
				throw new Error('No Dockerfile found')
			}

		})
	}
	
	function updatePipelines (pipelines, image) {
		return $http.put('api/user', {image: image, pipelines: pipelines})
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