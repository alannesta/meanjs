'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', '$resource', 'Customer', 'CustomerCollection', function ($scope, $resource, Customer, CustomerCollection) {

    var lastid = "";
    $scope.addLock = false;
    var underEditing = {};

  	CustomerCollection.query(function(data){
  		$scope.customers = data;
  	}, function(err){
  		console.log(err);
  	});

    $scope.addCustomer = function(){

      if($scope.addLock) return;
      getLastCid(function(result){
        var newid = result + 1;
        var trDom = "<tr><td>"+newid+"</td>"+
                  "<td contenteditable='true' ng-bind = 'customer.name'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.phone'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.weichat'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.name'></td>"+
                  "<td contenteditable='true' ng-bind = 'customer.note'></td></tr>";
        $("#datatable tbody").prepend($(trDom));
        $("tbody tr td")[1].focus();
      })
      $scope.addLock = true;
    }

    $scope.deleteCustomer = function(customer, index){
      console.log(index);
      // var reference = customer;
      var target = new Customer(customer);
      //the delete method is on the instance of the $resource
      target.$delete(function(data){
        console.log("delete success");
        $scope.customers.splice(index, 1);
      }, function(err){

      });
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
          cid: $this.parent().find('td')[0].innerHTML,
          name: $this.parent().find('td')[1].innerHTML,
          phone: $this.parent().find('td')[2].innerHTML,
          weichat: $this.parent().find('td')[3].innerHTML,
          note: $this.parent().find('td')[5].innerHTML,
        }

        //add id field if adding a new customer
        // if($scope.addLock){
        //   customerObj.cid = lastid+1
        // }

        console.log(customerObj.cid);
        if (customerObj.cid>0){
          upsertCustomer({cid: customerObj.cid}, customerObj)
        }else{
          
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
            newCustomer.cid = customerObj.cid;
            newCustomer.name = customerObj.name;
            newCustomer.phone = customerObj.phone;
            newCustomer.weichat = customerObj.weichat;
            newCustomer.note = customerObj.note;
            newCustomer.$save();
          }
          
        })
    }

    function getLastCid(callback){
      CustomerCollection.query({}, function(result){
        var largestCid = 0;
        // console.log(result);
        result.forEach(function(item, index){
          if (item.cid>largestCid){
            largestCid = item.cid;
          }
        })
        callback(largestCid);
        // return largestCid;
      })
    }
}]);
