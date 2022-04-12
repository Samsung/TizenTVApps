# Service App Debugging

Until current Tizen version (~6.5), there is no direct way to see the console.log() of service application via Tizen SDK. Tizen SDK only can capture 'console.log()' messages of UI application via remote inspector method.
This example introduces a way to catch service app's console messages via tizen.messageport API.
> You can see the guide document of tizen.messageport API
> - https://www.tizen.org/tv/web_device_api/messageport?langredirect=1

# Example
## UI Application
```javascript
  let localPort = tizen.messageport.requestLocalMessagePort('debugging.port');
  localPort.addMessagePortListener((data, remotePort) => {
    console.log(`key : ${data[0]['key']}, value : ${data[0]['value']}`);
    document.getElementById('message-box').innerHTML = data[0]['value'];
  });
```

## Service Application
> This way is only working while the UI application is alive. If UI application is not alive, there will be JS exception at requestRemoteMessagePort()
```javascript
let hasMessagePortException = false;
let remotePort = null;
let log = console.log;
console.log = (str) => {
  log(str);
  if (hasMessagePortException) return;
  try {
    if (!remotePort) {
      remotePort = tizen.messageport.requestRemoteMessagePort('8Y8kP6PZ6U.ServiceDebugging', 'debugging.port');
    }
    if (remotePort)
      remotePort.sendMessage([{ key: 'console-log', value: str }]);
  } catch(e) {
    hasMessagePortException = true;
  }
}

module.exports.onRequest = function () {
  console.log("onRequest");

  let cnt = 0;
  setInterval(function () {
    cnt++;
    if (cnt == 10) {
      tizen.application.getCurrentApplication().exit();
    }
    console.log(`cnt : ${cnt}`);
  }, 2000);
}

```
