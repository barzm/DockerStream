app.factory('User', function ($http) {
	function getAll () {
		return $http.get('/api/user')
		.then(function (response) {
			return response.data;
		})
	}

	return {
		get: getAll
	}
})