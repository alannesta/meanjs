'user strict';
var app = angular.module('customerManagement', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate'   //animation support
  ]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/customers', {
      templateUrl: 'views/list.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/customers'
    });
});

app.run(['$rootScope', '$route','$http', function($rootScope, $route, $http){

}]);