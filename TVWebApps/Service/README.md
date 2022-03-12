# Tizen Web Service
Tizen Web Service is a node application runnning on Node.js environment. In Tizen TV profile, this service application type has been supportable from Tizen 3.0.

Official Guide - https://docs.tizen.org/application/web/guides/applications/service-app/

## Life cycle
There are 3 events of service application lifecycle.
 - onStart
 - onRequest
 - onExit

onStart() is invoked when the service application is started. Almost at the same time onRequest() is also invoked.<br>
If someone trys to execute the service application, which is alive, then onRequest() is called only.<br>
When the service application is terminated by itself, or platform reason, onExit() will be invoked().

## Service application definition

You can create web service application by <tizen:service> tag on config.xml<br>
The `<tizen:content src=''>` in `<tizen:service>` is a start file of service application.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://yourdomain/SimpleService" version="1.0.0" viewmodes="maximized">
    <tizen:application id="rmyOMbyr0K.SimpleService" package="rmyOMbyr0K" required_version="2.3"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
    <icon src="icon.png"/>
    <name>SimpleService</name>
    <tizen:profile name="tv-samsung"/>
    <tizen:setting screen-orientation="landscape" context-menu="enable" background-support="disable" encryption="disable" install-location="auto" hwkey-event="enable"/>
    <tizen:service id="rmyOMbyr0K.service">
      <tizen:content src="service.js" />
      <tizen:name>SimpleService</tizen:name>
      <tizen:icon src="icon.png" />
      <tizen:description>Simple Web Service</tizen:description>      
    </tizen:service>
</widget>
```
