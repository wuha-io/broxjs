# API : alarms


## Manifest

To use this API you need to have the "alarms" permission.

## Object alarms

This object is returned from alarms.get() and alarms.getAll(), and is passed into the alarms.onAlarm listener.

- name<p>Name of this alarm.</p>
- scheduledTime<p> Time at which the alarm is scheduled to fire next, in milliseconds</p>
- periodInMinutes *Optional*<p>If this is not null, then the alarm is periodic, and this represents its period in minutes.</p>

## Method

```javascript
create(name, alarmInfo);
get(name);
getAll();
clear(name);
clearAll();
```

### alarmInfo

object. You can use this to specify when the alarm will initially fire, either as an absolute value (when), or as a delay from the time the alarm is set (delayInMinutes). To make the alarm recur, specify periodInMinutes.

- when<p>The time the alarm will fire first, given as milliseconds since the epoch. If you specify when, don't specify delayInMinutes.</p>

- delayInMinutes<p>The time the alarm will fire first, given as minutes from the time the alarm is set. If you specify delayInMinutes, don't specify when.</p>

- periodInMinutes<p>If this is specified, the alarm will fire again every periodInMinutes after its initial firing.</p>

### Example

```javascript
broxjs.alarms.create('my-alarms', {
  delayInMinutes: 5,
  periodInMinutes: 2
});

broxjs.alarms.get('my-alarms').then( alarm => {
  console.log('Alarms ', alarm.name, ' will execute in ', alarm.scheduledTime)
});

broxjs.alarms.clear('my-alarms').then(wasCleared => {
  console.log('alars was cleared');
});
```

## Event

Type of event

```
execute
```

Method

```javascript
addListener(type, function(Alarm alarm) { ... }) // Adds a listener to this event.
removeListener(type, function () { ... }) // Stop listening to this event. The listener argument is the listener to remove.
hasListener(type, function () { ... }) // Check whether listener is registered for this event. Returns true if it is listening, false otherwise.
```

### Example

```javascript
function handleAlarm(alarmInfo) {
  console.log("on alarm: " + alarmInfo.name);
}

broxjs.alarms.addListener(handleAlarm);
```
