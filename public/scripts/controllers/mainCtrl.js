'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', '$resource', '$http', 'Customer', 'CustomerCollection', function ($scope, $resource, $http, Customer, CustomerCollection) {

    $scope.addLock = false;
    var currentIndex = -1;   // refer to the current customer under editting
    var previousIndex = -1;

  	// CustomerCollection.query(function(data){
  	// 	$scope.customers = data.reverse();
  	// }, function(err){
  	// 	console.log(err);
  	// });
    $http.get('/customers').
      success(function(data, status, headers, config) {
          // console.log(status);
          $scope.customers = data.reverse();
          // $scope.$apply();
      }).
      error(function(data, status, headers, config) {
          console.log(status);
      });



    $scope.addCustomer = function(){
      if (currentIndex>-1){
        $scope.customers[currentIndex].editting = false;
      }
      
      
      if($scope.addLock) return;
      getLastCid(function(result){
        var newid = result + 1;
        var customerObj = {
          cid: newid,
          name: null,
          phone: null,
          weichat: null,
          appointment: null,
          note: null,
          editting: true
        }
        $scope.customers.unshift(customerObj);
        console.log($scope.customers);

      })
      $scope.addLock = true;
    }

    //save button handler
    $scope.saveCustomer = function(customer, index){

      if (currentIndex>-1){
        
        $scope.customers[currentIndex].editting = false;
      }
      
      var dom = $($("tbody").find('tr')[index]);
      var appointment = ""
      if(dom.find('div').length>0){
        appointment = dom.find('div').html();
        console.log(" from div"+ appointment);
      }else{

        appointment = dom.find('input').val();
        console.log(" from input"+ appointment);
      }
   
      // console.log("before");
      // console.log($scope.customers[index]);
      $scope.customers[index].cid= dom.find('td')[0].innerHTML
      $scope.customers[index].name= dom.find('td')[1].innerHTML
      $scope.customers[index].phone= dom.find('td')[2].innerHTML
      $scope.customers[index].weichat= dom.find('td')[3].innerHTML
      $scope.customers[index].appointment = appointment
      $scope.customers[index].note= dom.find('td')[5].innerHTML
      upsertCustomer({cid: $scope.customers[index].cid}, $scope.customers[index])
      $scope.customers[index].editting = false;
      // console.log("after");
      // console.log($scope.customers[index]);
      $scope.addLock = false;
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
        if (previousIndex == -1){
          $scope.customers[0].editting = false;
        }else{
          $scope.customers[previousIndex].editting = false;
        }
        
        if (previousIndex > -1){
          // debugger;
          // console.log("previous: " + previousIndex + " current: "+ currentIndex);
          // console.log(tempStorage);
          // $scope.customers[previousIndex] = angular.copy(tempStorage);
          // console.log($scope.customers[previousIndex]);
          // $scope.customers[previousIndex].editting = false;
          // $scope.$apply();
        }
      }

      // $scope.customers[currentIndex].cid= $this.parent().find('td')[0].innerHTML
      // $scope.customers[currentIndex].name= $this.parent().find('td')[1].innerHTML
      // $scope.customers[currentIndex].phone= $this.parent().find('td')[2].innerHTML
      // $scope.customers[currentIndex].weichat= $this.parent().find('td')[3].innerHTML
      // $scope.customers[currentIndex].note= $this.parent().find('td')[5].innerHTML

      previousIndex = currentIndex;
      // console.log("previous: " + previousIndex + " current: "+ currentIndex);
      // $this.addClass("table-editting");
      // tempStorage = angular.copy($scope.customers[currentIndex]);
      $scope.customers[currentIndex].editting = true;
      $scope.$apply();

  		return $this;
  	})

    /*
      update or insert the customer into the database;
    */
  	function upsertCustomer(keyObj, customerObj){
      var customer = Customer.get(keyObj, function(result){
          // console.log(result);
          // data[0].note = "changed successfully";

          if (result.length == 1){
            result[0].name = customerObj.name;
            result[0].phone = customerObj.phone;
            result[0].weichat = customerObj.weichat;
            result[0].appointment = customerObj.appointment;
            result[0].note = customerObj.note;
            result[0].$save();
          }else if (result.length == 0){    //no previous record under the phone or weichat, create a new resource
            console.log("insert")
            var newCustomer = new Customer();
            newCustomer.cid = customerObj.cid;
            newCustomer.name = customerObj.name;
            newCustomer.phone = customerObj.phone;
            newCustomer.weichat = customerObj.weichat;
            newCustomer.appointment = customerObj.appointment;
            newCustomer.note = customerObj.note;
            newCustomer.$save();

            $http.post('/customers/'+ customerObj.cid, {
                cid: customerObj.cid,
                name: customerObj.name,
                phone: customerObj.phone,
                weichat: customerObj.weichat,
                appointment: customerObj.appointment,
                note: customerObj.note,
            }).
            success(function(data, status, headers, config){

            }).
            error(function(data, status, headers, config){
                console.log(status);
            });
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
