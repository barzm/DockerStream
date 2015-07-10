app.directive('pipe',function($mdDialog,Pipeline){
	return {
		restrict: 'E',
		scope: {
			pipe: '=',
			pipeline: '=',
			index: '='
		},
		templateUrl: '/js/common/directives/pipe/pipe.html',
		link: function(scope,elem,attr){

			scope.checkFirst = setTimeout(function(){
				Pipeline.poll(scope.pipeline.pipelineId,scope.pipe.imageId)
				.then(function (response){
					console.log("FIRST POLL",scope.pipeline.pipelineId);
					if(response.data){
						scope.icon = 'check',
						scope.status = 'Ready'
					}else{
						scope.icon='wrench',
						scope.status='Building...'
					}
				})
			},0);

				scope.checkBuild = setInterval(function(){
					console.log("CHECK BUILD");
					Pipeline.poll(scope.pipeline.pipelineId,scope.pipe.imageId)
					.then(function(response){
						if(response.data){
							scope.icon = 'check';
							scope.status = 'Ready';
							scope.clearPoll();
						}else{
							scope.icon='wrench',
							scope.status='Building...'
						}
					})
				},10000);

			scope.clearPoll = function(){
				console.log('CLEAR CHECK BUILD');
				clearInterval(scope.checkBuild);
			}

			scope.deleteRepo = function(pipeline, ix, repo) {
				clearInterval(scope.checkBuild);
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