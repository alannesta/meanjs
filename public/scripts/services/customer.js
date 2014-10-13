'use strict';

app.factory('Customer', ['$resource', function($resource){
	return $resource('/customers', {}, {});
}])