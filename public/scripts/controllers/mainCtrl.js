'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', 'Customer', 'CustomerCollection', function ($scope, Customer, CustomerCollection) {
  	CustomerCollection.query(function(data){
  		$scope.customers = data;
  	}, function(err){
  		console.log(err);
  	});

  	//editable table;
  	$('#datatable').on('focus', '[contenteditable]', function() {
  		var $this = $(this);
  		$this.data('before', $this.html());
  		$this.addClass("table-editting");
  		return $this;
  	}).on('blur', '[contenteditable]', function() {
  		//DOM operations
  		var $this = $(this);
  		if ($this.data('before') !== $this.html()) {
  			$this.data('before', $this.html());
  			$this.trigger('change');

  			//data base operations:
	  		var tel = $this.parent().find('td')[1].innerHTML;
	  		var weichat = $this.parent().find('td')[2].innerHTML;
	  		var customer = Customer.get({phone: tel}, function(data){
	  			// console.log(data);
	  			data[0].note = "changed successfully";
	  			data[0].$save();
	  			// console.log(customer[0]);
	  		})
  		}
  		$this.removeClass("table-editting");

  		return $this;
  	});

  	// $("#datatable").on('change', function(){
  	// 	alert("change");
  	// })

}]);
