describe('customer management home page', function() {
  it('should add a customer', function() {
    browser.get('http://localhost:3000/');
    var length, length2;

    var customerList = element.all(by.repeater('customer in customers'));
    customerList.count().then(function(data){
    	length = data;
    });
    var button = element(by.id('addbtn'))
    button.click();
    var customerList2 = element.all(by.repeater('customer in customers'));
    
    customerList2.count().then(function(data){
    	length2 = data;
    	console.log(length2);
    	expect(length+1).toEqual(length2);
    });
    
  });
});