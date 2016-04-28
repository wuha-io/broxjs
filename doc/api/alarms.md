
# API : alarms

## Manifest

To use this API you need to have the "alarms" permission.

## Object alarms

This object is returned from alarms.get() and alarms.getAll(), and is passed into the alarms.onAlarm listener.

|Attributes|Value|Description|
|:----------|:----------|:----------|
|name           |string|Name of this alarm.|
|scheduledTime  |double|Time at which the alarm is scheduled to fire next, in milliseconds|
|periodInMinutes *Optional*|double|If this is not null, then the alarm is periodic, and this represents its period in minutes.|

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

|List of all options|Value|Description|
|:----------|:----------|:----------|
|when  *Optional*|double|The time the alarm will fire first, given as milliseconds since the epoch. If you specify when, don't specify delayInMinutes.|
|delayInMinutes  *Optional*|double|The time the alarm will fire first, given as minutes from the time the alarm is set. If you specify delayInMinutes, don't specify when.|
|periodInMinutes  *Optional*|double|If this is specified, the alarm will fire again every periodInMinutes after its initial firing.|

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
start
end
```

Method

```javascript
addListener(type, alarm => { ... }) // Adds a listener to this event.
removeListener(type, alarm => { ... }) // Stop listening to this event. The listener argument is the listener to remove.
hasListener(type, alarm => { ... }) // Check whether listener is registered for this event. Returns true if it is listening, false otherwise.
```

### Example

```javascript
function handleAlarm(alarmInfo) {
  console.log("on alarm: " + alarmInfo.name);
}

broxjs.alarms.addListener(handleAlarm);
```
