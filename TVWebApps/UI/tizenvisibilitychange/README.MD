# tizenvisibilitychange

`tizenvisibilitychange` event has been introduced since Tizen 6.0 to solve a problem that the webapp can't know when it becomes visible actually at launching time.

In Tizen platform, the conventional way to catch the visible time is `visibilitychange` event. However it is not fired on launching time because of initial visible state of chromium-efl and since this manner has been kept until Tizen 6.0, it is hard to decide to dispatch the `visibilitychange` event on the creating time for platform compatibility.
 - https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event

Thus, in Tizen TV profile, WRT team introduced newly `tizenvisibilitychange` event to solve this problem.

```javascript
document.addEventListener('tizenvisibilitychange', function(event) {
  if (event.detail.visible)  { // 1 is visible, 0 is invisible
  }
});
```
