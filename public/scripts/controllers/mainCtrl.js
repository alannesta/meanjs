'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', '$resource', 'Customer', 'CustomerCollection', function ($scope, $resource, Customer, CustomerCollection) {

    $scope.addLock = false;

  	CustomerCollection.query(function(data){
  		$scope.customers = data;
  	}, function(err){
  		console.log(err);
  	});

    $scope.addCustomer = function(){

      if($scope.addLock) return;

      var trDom = "<tr><td contenteditable='true' ng-bind = 'customer.name'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.phone'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.weichat'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.name'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.note'></td></tr>";
      $("#datatable tbody").prepend($(trDom));
      $("tbody tr td")[0].focus();
      $scope.addLock = true;
    }


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
  			// $this.trigger('change');

  			//data base operations:
        var customerObj = {
          name: $this.parent().find('td')[0].innerHTML,
          phone: $this.parent().find('td')[1].innerHTML,
          weichat: $this.parent().find('td')[2].innerHTML,
          note: $this.parent().find('td')[4].innerHTML,
        }
        console.log(customerObj.phone);
        if (customerObj.phone.length>0){
          upsertCustomer({phone: customerObj.phone}, customerObj)
        }else if (customerObj.weichat.length>0){
          upsertCustomer({weichat: customerObj.weichat}, customerObj)
        }else{
          console.log("need to specify either weichat or phone to save");
        }
  		}
  		$this.removeClass("table-editting");

  		return $this;
  	});

    /*
      update or insert the customer into the database;
    */
  	function upsertCustomer(keyObj, customerObj){
      var customer = Customer.get(keyObj, function(result){
          console.log(result);
          // data[0].note = "changed successfully";

          if (result.length == 1){
            result[0].name = customerObj.name;
            result[0].phone = customerObj.phone;
            result[0].weichat = customerObj.weichat;
            result[0].note = customerObj.note;
            result[0].$save();
          }else if (result.length == 0){    //no previous record under the phone or weichat, create a new resource
            var newCustomer = new Customer();
            newCustomer.name = customerObj.name;
            newCustomer.phone = customerObj.phone;
            newCustomer.weichat = customerObj.weichat;
            newCustomer.note = customerObj.note;
            newCustomer.$save();
          }
          
        })
    }

}]);
