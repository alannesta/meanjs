describe('Unit: MainCtrl', function() {
  // Load the module with MainController
  beforeEach(module('customerManagement'));
  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $resource, _$httpBackend_,$injector) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    controller = $controller
    service = $injector.get('CustomerCollection');
    resource = $resource;
    $httpBackend = $injector.get('$httpBackend');;

    // Create the controller
    ctrl = $controller('MainCtrl', {
      $scope: scope,
      $resource: resource,
      service: service
    });
  }));

  it('should create $scope.greeting when calling sayHello', 
    function() {

      expect(scope.greeting).toBeUndefined();
      scope.sayHello();
      expect(scope.greeting).toEqual("Hello Ari");
  });

  it('customers array add by one when calling addCustomer function', function(){   //inject the service

    //http://tech.pro/q/57/angularjs-unit-testing-using-jasmine-and-resource-backend
    //http://stackoverflow.com/questions/21295990/service-injection-to-test-controller-jasmin
    // should just use _$httpBackend_ to mock the data, no actual http calls in unit test!
    
    var flag = false;

    $httpBackend.whenGET('/customers').respond([{
      name:"kaka",
      age: "19"
    }])

    scope.customers = $httpBackend.flush();

    var length = scope.customers.length;
    scope.addCustomer();
    expect(scope.customers.length).toEqual(length+1);
    

  })
})