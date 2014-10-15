'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', '$resource', 'Customer', 'CustomerCollection', function ($scope, $resource, Customer, CustomerCollection) {

    $scope.addLock = false;
    var currentIndex = -1;   // refer to the current customer under editting
    var previousIndex = -1;

  	CustomerCollection.query(function(data){
  		$scope.customers = data.reverse();
  	}, function(err){
  		console.log(err);
  	});

    $scope.addCustomer = function(){

      if($scope.addLock) return;
      getLastCid(function(result){
        var newid = result + 1;
        var customerObj = {
          cid: newid,
          name: "",
          phone: "",
          weichat: "",
          note: "",
          editting: true
        }
        $scope.customers.unshift(customerObj);

        // var trDom = "<tr><td>"+newid+"</td>"+
        //           "<td contenteditable='true' ng-bind = 'customer.name'></td>"+
        //           "<td contenteditable='true' ng-bind = 'customer.phone'></td>"+
        //           "<td contenteditable='true' ng-bind = 'customer.weichat'></td>"+
        //           "<td contenteditable='true' ng-bind = 'customer.name'></td>"+
        //           "<td contenteditable='true' ng-bind = 'customer.note'></td></tr>";
        // $("#datatable tbody").prepend($(trDom));
        // $("tbody tr td")[1].focus();

        // var button = $("<td><button class='btn btn-success' id='savebtn'>Save</button></td>");
        // button.on('click', function(){
        //   console.log("save");
        // })
        // var parent = $($("tbody tr")[0])
        // parent.find("button").css("display","none");
        // parent.append(button);

        // console.log($("tbody tr")[0]);

      })
      $scope.addLock = true;
    }

    //save button handler
    $scope.saveCustomer = function(customer, index){
      console.log("called");
      console.log($scope.customers[index]);
      upsertCustomer({cid: $scope.customers[index].cid}, $scope.customers[index])
      $scope.customers[currentIndex].editting = false;
    }

    //cancel button handler
    $scope.cancelEdit = function(){

    }

    //delete button handler
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
  	$('#datatable').on('focus', '[contenteditable]', function(event) {
  		var $this = $(this);
      var $that = $(this);  
      
  		
      //get the index of the current editted tr in the dom tree(to match the customer in the customers array)
      $("tbody").find("tr").each(function(index, item){
        if ($(this).find("td")[0].innerHTML == $that.parent().find("td")[0].innerHTML){
          currentIndex = index;
        }
      });
      if (previousIndex != currentIndex){
        console.log("previous: " + previousIndex + " current: "+ currentIndex);
        //TODO: restore data for customers[previousIndex]
        event.preventDefault();
        return;
      }

      console.log("previous: " + previousIndex + " current: "+ currentIndex);
      $this.addClass("table-editting");
      $scope.customers[currentIndex].editting = true;
      $scope.$apply();

  		return $this;
  	})

    $('#datatable').on('blur', '[contenteditable]', function() {

      var $this = $(this);
      var $that = $(this); 

      $scope.customers[currentIndex].cid= $this.parent().find('td')[0].innerHTML
      $scope.customers[currentIndex].name= $this.parent().find('td')[1].innerHTML
      $scope.customers[currentIndex].phone= $this.parent().find('td')[2].innerHTML
      $scope.customers[currentIndex].weichat= $this.parent().find('td')[3].innerHTML
      $scope.customers[currentIndex].note= $this.parent().find('td')[5].innerHTML
      
      $("tbody").find("tr").each(function(index, item){
        if ($(this).find("td")[0].innerHTML == $that.parent().find("td")[0].innerHTML){
          previousIndex = index;
        }
      });

      // console.log($scope.currentFocus);
      // $scope.currentFocus.editting = false;
      $scope.$apply();
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
            console.log("insert")
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

    //utility functions

    function getCurrentEditting(){

    }


    //get the last(largest) cid in db
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
