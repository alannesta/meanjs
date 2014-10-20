describe('Unit: MainCtrl', function() {
  // Load the module with MainController
  beforeEach(module('customerManagement'));
  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $injector, $resource, CustomerCollection) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    controller = $controller
    service = $injector.get('CustomerCollection');
    resource = $resource;
    // Create the controller
    // ctrl = $controller('MainCtrl', {
    //   $scope: scope,
    //   $resource: resource,
    //   CustomerCollection: service
    // });
  }));

  it('should create $scope.greeting when calling sayHello', 
    function() {

      ctrl = controller('MainCtrl', {
        $scope: scope,
        $resource: resource,
        CustomerCollection: service
      });
      expect(scope.greeting).toBeUndefined();
      scope.sayHello();
      expect(scope.greeting).toEqual("Hello Ari");
  });

  it('customers array add by one when calling addCustomer function', function(){   //inject the service

    
    ctrl = controller('MainCtrl', {
      $scope: scope,
      $resource: resource,
      service: service
    });

    var flag = false;
    runs(function(){
      expect(service).toBeDefined();
      service.query(function(data){
        scope.customers = data;
        flag = true;
      }, function(err){
        console.log(err);
      });
      // setTimeout(function(){
      //   flag =true;
      // }, 2000)
    });

    waitsFor(function(){
      return flag;
    }, "should get customer data and populates the array");

    runs(function(){
      var length = scope.customers.length;
      scope.addCustomer();
      expect(scope.customers.length).toEqual(length+1);
    })

  })
})