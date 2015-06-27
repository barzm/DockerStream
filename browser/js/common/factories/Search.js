app.factory('Search', function($http){
	function searchRepositories (input) {
		input = input.replace(/ /g, '+')
		return $http.get(`/api/search/${ input }`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (err) {
			console.error(`err ${ err }`);
		})
	}

	return {
		repositories: searchRepositories
	}


})