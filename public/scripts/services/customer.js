'use strict';

app.factory('CustomerCollection', ['$resource', function($resource){
	return $resource('/customers', {}, {});
}])

app.factory('Customer', ['$resource', function($resource){
	return $resource('/customers/:phone', {phone: "@phone"}, {
		'get': {method:'GET', isArray:true},
		'save':   {method:'POST'},
		'query':  {method:'GET', isArray:true},
		'remove': {method:'DELETE'},
		'delete': {method:'DELETE'} 
	});
}])