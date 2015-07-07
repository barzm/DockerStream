app.config(function($stateProvider) {

    $stateProvider.state('help', {
        url: '/help',
        templateUrl: 'js/help/help.html',
        controller: 'HelpCtrl'
    });

});

app.controller('HelpCtrl',function($scope){

})
