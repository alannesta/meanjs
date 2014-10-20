'use strict';

angular.module('customerManagement')
  .controller('MainCtrl', ['$scope', '$resource', '$http', 'Customer', 'CustomerCollection', 'Calendar', function ($scope, $resource, $http, Customer, CustomerCollection, Calendar) {

    $scope.addLock = false;
    $scope.dblclickLock = false;
    $scope.addFlag = false;
    var tempStorage = {};

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


    $scope.sayHello = function(){
      $scope.greeting = "Hello Ari";
    }

    $scope.addCustomer = function(){
      
      if($scope.addLock) return;
      getLastCid(function(result){
        var newid = result + 1;
        var customerObj = {
          cid: newid,
          name: null,
          phone: null,
          weichat: null,
          appointment: null,
          note: null
        }
        $scope.customers.unshift(customerObj);
        console.log($scope.customers);
        // $scope.addLock = true;
        // $scope.dblclickLock = true;
        // customerObj.editting = true;
        $scope.addFlag = true;
        startEditting(customerObj);
      })
    }


    $scope.saveCustomer = function(customer, index){
      if (customer.appointment){
        customer.appointment = moment(customer.appointment).toISOString();   //process the data to ISO format
      }
      
      upsertCustomer({cid: customer.cid}, customer, function successHandler(){
        // $scope.addLock = false;
        // customer.editting = false;
        // $scope.dblclickLock = false;
        endEditting(customer);
        $scope.addFlag = false;
      })
    }

    //cancel button handler
    $scope.cancelEdit = function(customer){
      console.log(customer)
      // customer = angular.copy(tempStorage);  // this will not work because change the reference itself. it points to a different thing now
      for (var prop in tempStorage){
        customer[prop] = tempStorage[prop];
      }

      

      //if in adding phase, shift the first obj when cancel
      if ($scope.addFlag){
        $scope.customers.shift($scope.customers[0]);
      }
      endEditting(customer);
      $scope.addFlag = false;
      // customer.editting = false;
      // $scope.addLock = false;
      // $scope.dblclickLock = false;
      console.log(customer);
    }

    $scope.editCustomer = function(customer){
      // tempStorage = angular.copy(customer);
      // tempStorage = angular.extend({}, customer)
      if ($scope.dblclickLock){
        return;
      }
      tempStorage = JSON.parse(JSON.stringify(customer));   //make a copy of the current one
      // $scope.addLock = true;
      // customer.editting = true;
      // $scope.dblclickLock = true;
      startEditting(customer);
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

    $scope.auth = function(){
      console.log("auth");
      Calendar.auth();
    }

    $scope.getCalendarList = function(){
      // console.log("auth");
      Calendar.getCalendarList();
    }

    $scope.syncCalendar = function(customer, index){
      var events = {
        "summary": customer.name + "("+ customer.phone +"): "+ customer.note,
        "location": "Angrinion Park",
        "start": {
          "dateTime": customer.appointment
        },
        "end": {
          "dateTime": customer.appointment
        }
      }
      try{
        Calendar.addCalendarEvent(events);
      }catch(e){
        alert("同步失败，请联系丝丝同学");
      }

    }

    $scope.focusHandler = function(customer){
      
    }

    $scope.blurHandler = function(customer){
      console.log("blur");
      // customer.editting = false;
    }

    /*
      update or insert the customer into the database;
    */
  	function upsertCustomer(keyObj, customerObj, callback){
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
            callback();
          }else if (result.length == 0){    //no previous record under the phone or weichat, create a new resource
            console.log("insert")
            var newCustomer = new Customer(customerObj);
            // newCustomer.$save();

            $http.post('/customers/'+ customerObj.cid, {
                cid: customerObj.cid,
                name: customerObj.name,
                phone: customerObj.phone,
                weichat: customerObj.weichat,
                appointment: customerObj.appointment,
                note: customerObj.note,
            }).
            success(function(data, status, headers, config){
              callback();
            }).
            error(function(data, status, headers, config){
                console.log(status);
            });
          }
          
        })
    }

    //utility functions
    function startEditting(customer){
      $scope.addLock = true;
      customer.editting = true;
      $scope.dblclickLock = true;
    }

    function endEditting(customer){
      $scope.addLock = false;
      customer.editting = false;
      $scope.dblclickLock = false;
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
      })
    }


}]);
