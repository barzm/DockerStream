app.config(function($stateProvider) {

    $stateProvider.state('pipelines', {
        url: '/pipelines',
        templateUrl: 'js/pipelines/pipelines.html',
        controller: 'PipelinesCtrl'
    });

});

app.controller('PipelinesCtrl', function($scope, Pipeline, $state, $stateParams, $mdDialog) {
    $scope.pipelineName = null;
    $scope.created = false;
    $scope.searchInput = null;
    $scope.models = {};
    $scope.loc = window.location.host;
    $scope.saved = 'untouched';
    $scope.alert = '';
    $scope.showConfirm = renderConfirmation;

    $scope.search = function(input) {
        $state.go('search', {
            input: input
        });
    };

    $scope.getRepoByUrl = function(url, pipelineId) {
        Pipeline.getByUrl(url)
            .then(function(response) {
                return Pipeline.add({
                    id: pipelineId,
                    repo: response
                })
            })
            .then(function(response) {
                $scope.getPipelines();
            }, function(err) {
                console.log('Error in recieving pipelines: ', err);
            })
    };

    $scope.getUrl = function(id) {
        return `http://${$scope.loc}/api/run?id=${id}`;
    };


    $scope.createPipeline = function() {
        if (!$scope.pipelineName) return;
        Pipeline.create($scope.pipelineName)
            .then(function(response) {
                $scope.created = true;
                $scope.pipelineName = '';
                $scope.models.list = makePipelineModel(response);
            });
    };

    $scope.getPipelines = function() {
        Pipeline.get()
            .then(function(response) {
                var obj = makePipelineModel(response);
                $scope.models = {
                    selected: null,
                    list: obj
                }
            })
    };

    $scope.updatePipelines = function() {
        Pipeline.update($scope.models.list)
            .then(function(response) {
                $scope.saved = 'saved';
            })
    };

    $scope.reorder = function() {
        for (var pipelineObj in $scope.models.list) {
            $scope.models.list[pipelineObj].pipeline
                .map(function(repo, ix) {
                    repo.order = ix;
                })
        }
        $scope.saved = 'unsaved';
    };

    $scope.deleteRepo = function(pipeline, ix) {
        $scope.models.list[pipeline.name].pipeline.splice(ix, 1);
        $scope.reorder();
        $scope.updatePipelines();
    };

    $scope.deletePipeline = function(pipeline) {
        Pipeline.delete(pipeline)
            .then(function() {
                delete $scope.models.list[pipeline.name];
            })
    };

    function makePipelineModel(data) {
        var obj = {};
        data.pipelines.forEach(function(pipeline) {
            obj[pipeline.name] = {
                pipelineId: pipeline._id,
                name: pipeline.name,
                pipeline: pipeline.pipeline
            }
        })
        return obj;
    };

    var renderConfirmation = function(ev) {
        console.log('EVENT', ev);
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Are you sure you want to delete this repository?')
            .content('This repository will be deleted, along with it\'s associated Docker image.')
            .ariaLabel('Warning')
            .ok('DELETE')
            .cancel('CANCEL')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
          $scope.alert = 'You decided to get rid of your debt.';
        }, function() {
          $scope.alert = '';
        });
    };

    $scope.getPipelines();


});