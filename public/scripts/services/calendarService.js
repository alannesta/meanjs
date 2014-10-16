app.service("Calendar", function(){
    var clientId = '1019400455574-lqq6slo5jd224r3r1m1he4urd2k9ast1.apps.googleusercontent.com';
    var apiKey = 'AIzaSyBaydTxzKE8DOJ9DxpypVw5mpcwmuCmWr4';
    var scopes = "https://www.googleapis.com/auth/calendar";

    function authCalendar(){
        gapi.client.setApiKey(apiKey);
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    }
    
    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        console.log("Auth success");
        makeApiCall();
      }
    }

    function makeApiCall(){
        console.log("get all calendar call");
        //load calendar api
        gapi.client.load('calendar', 'v3', function() {
          //get all calendar events
          var request = gapi.client.calendar.events.list({ 
              'calendarId': 'primary' 
          }); 
          request.execute(function(resp) { 
              console.log (resp);
          });
        });
    }
    return {
        auth: authCalendar
    }

});