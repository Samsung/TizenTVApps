# Share files

It is able to share files between UI and service application with tizen.filesystem
 - https://docs.tizen.org/application/web/guides/data/file-system/

`wgt-private` is a virtual path located application's private folder.

# Example
## UI Application
```javascript
  let fileHandleWrite = tizen.filesystem.openFile("wgt-private/test.dat", "w");
  fileHandleWrite.writeString("this is string by UI app");
  fileHandleWrite.close();
```

## Service Application
```javascript
  let fileHandleRead = tizen.filesystem.openFile("wgt-private/test.dat", "r");
  let fileContent = fileHandleRead.readString();
  console.log("File content: " + fileContent);
  fileHandleRead.close();
```
