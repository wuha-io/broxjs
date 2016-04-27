# API : notification


## Manifest

To use this API you need to have the "notifications" permission.

## Method

```javascript
create(id, options);
update(options);
close();
getAll();
```

## Options
|List of all options|Value|Description|
|:----------|:----------|:----------|
|type        | basic | The type of notification you want.<br> Depending on your choice here, certain other properties are either mandatory or are not permitted.|
|iconUrl     | String      | A URL pointing to an icon to display in the notification.|
|title       | String      | The notification's title.|
|message     | String      | The notification's main content.|

### Example

```javascript
var notifId = null;

broxjs.notification.create({title: 'this is a title', message: 'this is a message'})
  .then( notif => {
    return notif.update({title: 'this is a new title'});
  })
  .then(notif => notif.close());
```

## Event

Type of event

```
closed
clicked
buttonClicked
```

Method

```javascript
addListener(type, function(Notif notif, boolean byUser) { ... }) // Adds a listener to this event.
removeListener(type, function () { ... }) // Stop listening to this event. The listener argument is the listener to remove.
hasListener(type, function () { ... }) // Check whether listener is registered for this event. Returns true if it is listening, false otherwise.
```

### Example

```javascript
broxjs.notification.addListener('closed', function (notif) {
  console.log('notif with id ', notif.id, 'is closed');
});
```
