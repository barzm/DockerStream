app.config(function($stateProvider) {

    $stateProvider.state('help', {
        url: '/help',
        templateUrl: 'js/help/help.html',
        controller: 'HelpCtrl'
    })
    .state('help.about', {
        url: '/about',
        templateUrl: 'js/help/about.html'
    })
    .state('help.prep', {
        url: '/prep',
        templateUrl: 'js/help/prep.html'
    })
    .state('help.edit', {
        url: '/edit',
        templateUrl: 'js/help/edit.html'
    })
    .state('help.run', {
        url: '/run',
        templateUrl: 'js/help/run.html'
    });

});

app.controller('HelpCtrl',function($scope){

  $scope.tabs = [
    { title:'About Ahab', state:'help.about' },
    { title:'Preparing Pipes', state:'help.prep' },
    { title:'Creating and Editing Pipelines', state:'help.edit'},
    { title:'Running a Pipeline', state:'help.run'}
  ];

  // $scope.changeTab = function(tabState){
  //   console.log("changing tabs!!",tabState);
  //   $state.go('help.' + tabState);
  // }


})
