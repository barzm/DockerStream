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

	function addToPipeline (info) {
		return $http.put('api/pipelines', info)
		.then(function(response) {
			console.log('from adding', response.data)
			return response.data;
		})
	}

	return {
		create: createPipeline,
		get: getPipelines,
		add: addToPipeline
	}
})