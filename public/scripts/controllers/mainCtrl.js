'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', 'Customer', function ($scope, Customer) {
  	Customer.query(function(data){
  		console.log(data);
  		$scope.customers = data;
  	}, function(err){
  		console.log(err);
  	});
}]);
