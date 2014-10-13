'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', 'Customer', function ($scope, Customer) {
  	Customer.query(function(data){
  		console.log(data);
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
  		var $this = $(this);
  		if ($this.data('before') !== $this.html()) {
  			$this.data('before', $this.html());
  			$this.trigger('change');
  			// console.log("change");
  		}
  		$this.removeClass("table-editting");
  		return $this;
  	});

  	// $("#datatable").on('change', function(){
  	// 	alert("change");
  	// })

}]);
