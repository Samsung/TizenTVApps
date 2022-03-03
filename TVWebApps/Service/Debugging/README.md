# Service App Debugging

Until current Tizen version (~6.5), there is no simple way to see the console.log() of service application via Tizen SDK. Tizen SDK only can capture 'console.log()' messages of UI application via remote inspector method.
This example introduces a way to catch service app's console messages via tizen.messageport API.<br>
You can see the document of tizen.messageport API
 - https://www.tizen.org/tv/web_device_api/messageport?langredirect=1

## UI Application
```
  var localPort = tizen.messageport.requestLocalMessagePort('debugging.port');
  localPort.addMessagePortListener((data, remotePort) => {
    console.log(`key : ${data[0]['key']}, value : ${data[0]['value']}`);
    document.getElementById('message-box').innerHTML = data[0]['value'];
  });
```

## Service Application
```
var remotePort = null;
var log = console.log;
console.log = function (str) {
  log(str);

  if (!remotePort) {
    remotePort = tizen.messageport.requestRemoteMessagePort('8Y8kP6PZ6U.ServiceDebugging', 'debugging.port');
  }
  if (remotePort)
    remotePort.sendMessage([{ key: 'console-log', value: str }]);
}

module.exports.onRequest = function () {
  console.log("onRequest");

  var cnt = 0;
  setInterval(function () {
    cnt++;
    if (cnt == 10) {
      tizen.application.getCurrentApplication().exit();
    }
    console.log(`cnt : ${cnt}`);
  }, 2000);
}

```
