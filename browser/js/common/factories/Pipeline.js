app.factory('Pipeline', function($http) {

	function addToPipeline () {
		return $http.post('/api/pipeline')
		.then(function (response) {
			return response.data;
		})
	}

	return {
		add: addToPipeline
	}
})