app.service("Calendar", function(){
    var clientId = '1019400455574-lqq6slo5jd224r3r1m1he4urd2k9ast1.apps.googleusercontent.com';
    var apiKey = 'AIzaSyBaydTxzKE8DOJ9DxpypVw5mpcwmuCmWr4';
    var scopes = "https://www.googleapis.com/auth/calendar";

    var scriptLoaded = false;

    function authCalendar(){
        gapi.client.setApiKey(apiKey);
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);

    }
    
    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        console.log("Auth success");
        loadScript(function(){
          console.log("script loaded");
        });
      }
    }

    function loadScript(callback){
      gapi.client.load('calendar', 'v3', function(){
        scriptLoaded = true;
        callback();
      });
    }

    function getCalendarList(){
        console.log("get all calendar call");
        var request = gapi.client.calendar.events.list({ 
            'calendarId': 'primary' 
        }); 
        if (scriptLoaded){
          request.execute(function(resp) { 
              console.log (resp);
          });
        }else{
          //load calendar api
          loadScript(function() {
            request.execute(function(resp) { 
                console.log (resp);
            });
          });
        }
        
    }

    function addCalendarEvent(eventObj){
        var request2 = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': eventObj
        });
        if(scriptLoaded){
          request2.execute(function(resp) {
            console.log(resp);
            alert("同步成功！")
          });
        }else{
          loadScript(function() {
            request2.execute(function(resp) {
              console.log(resp);
              alert("同步成功！")
            });
          });
        }
    }


    return {
        auth: authCalendar,
        getCalendarList: getCalendarList,
        addCalendarEvent: addCalendarEvent
    }

});