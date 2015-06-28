app.factory('Pipeline', function($http) {




	function createPipeline (pName) {
		return $http.post('/api/pipelines', {name: pName})
		.then(function (response) {
			return response.data;
		})
	}

	return {
		create: createPipeline
	}
})