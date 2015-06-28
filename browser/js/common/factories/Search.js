app.factory('Search', function($http){

	function searchRepositories (input) {
		input = input.replace(/ /g, '+')
		return $http.get(`/api/search/${ input }`)
		.then(function (response) {
			console.log(response);
			return response.data;
		})
		.catch(function (err) {
			console.error(`err ${ err }`);
		})
	}

	function searchMyRepositories(user) {
		console.log(user);
		return $http.get(`/api/search/users/${ user }`)
		.then(function(response) {
			return response.data;
		})
		.catch(function(err) {
			console.error(`err ${ err }`);
		})
	}

	return {
		repositories: searchRepositories,
		myRepositories: searchMyRepositories
	}

})