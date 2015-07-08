app.config(function($stateProvider) {

    $stateProvider.state('help', {
        url: '/help',
        templateUrl: 'js/help/help.html',
        controller: 'HelpCtrl'
    });

});

app.controller('HelpCtrl',function($scope){
  $scope.tabs = [
    { title:'About Ahab', content:'Dynamic content 1' },
    { title:'Preparing Pipes', content:'Dynamic content 1' },
    { title:'Adding Pipes', content:'Dynamic content 2'},
    { title:'Editing Pipelines', content:'Dynamic content 2'},
    { title:'Running a Pipeline', content:'Dynamic content 2'}
  ];
})
