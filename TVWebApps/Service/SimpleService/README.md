# SimpleService

This example shows how to launch web service application by Tizen AppControl.
By Tizen webapi 'tizen.application.launchApp()' can execute the service application with AppControl data.

## UI application
```javascript
const serviceId = 'rmyOMbyr0K.service';

function launchServiceByAppcontrol() {
    tizen.application.launchAppControl(
        new tizen.ApplicationControl(
            'http://tizen.org/appcontrol/operation/pick', null, '', null,
            [new tizen.ApplicationControlData('data_0', ["hello", "world"])]
        ),
        serviceId,
        function() {
            console.log('Launch success: ' + serviceId);
        },
        function(error) {
             console.log(JSON.stringify(error));
        }
    );
}
```

## Service application
```javascript
module.exports.onRequest = function() {
  console.log("onRequest");
  
  var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
  if (reqAppControl && reqAppControl.appControl.operation == 'http://tizen.org/appcontrol/operation/pick') {
	  console.log('appcontrol case')
      var appControlData = reqAppControl.appControl.data;
      var data_0 = appControlData[0];
      console.log(data_0.value[0]);
      console.log(data_0.value[1]);
  } else {
      console.log('default case')
  }
}

```
