app.directive('pipe',function($mdDialog){
	return {
		restrict: 'E',
		scope: {
			pipe: '=',
			pipeline: '=',
			index: '='
		},
		templateUrl: '/js/common/directives/pipe/pipe.html',
		link: function(scope,elem,attr){

			console.log("ISOLATE REPO")

			scope.deleteRepo = function(pipeline, ix, repo) {
				debugger;
				scope.$emit('deleteRepo',[pipeline,ix,repo]);	
			};

			scope.showConfirm = function(ev, repo, pipeline, ix) {
				console.log('repo', repo)
				var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title(`Are you sure you want to delete ${repo.name}?`)
				.content('This repository will be deleted, along with its associated Docker image.')
				.ariaLabel('Warning')
				.ok('DELETE')
				.cancel('CANCEL')
				.targetEvent(ev);
				$mdDialog.show(confirm).then(function() {
					scope.$emit('deleteRepo',[pipeline,ix,repo]);
				});
			};
		}
	}
})