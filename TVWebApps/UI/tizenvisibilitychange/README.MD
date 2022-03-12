# tizenvisibilitychange

`tizenvisibilitychange` event has been introduced since Tizen 6.0 to solve a problem that the webapp can't know when it becomes visible actually at launching time.

In Tizen platform, the conventional way to catch the visible time is `visibilitychange` event. However it is not fired at launching time because the initial state of visibility is `visible`
 - https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event

Thus, in Tizen TV profile, WRT team introduced `tizenvisibilitychange` event to solve this problem.

```javascript
document.addEventListener('tizenvisibilitychange', function(event) {
  if (event.detail.visible)  { // 1 is visible, 0 is invisible
  }
});
```