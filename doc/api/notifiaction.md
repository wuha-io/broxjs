
# API : notification


## Manifest

To use this API you need to have the "notifications" permission.

## Method

```
create(id, options, function(id) { ... });
update(id, options, function(boolean wasUpdated) { ... });
clear(id, function (boolean wasCleared) { ... });
getAll(function ());
```

## Options
|List of all options|Value|Description
|:-|:-|:-|
|type        | basic | The type of notification you want.<br> Depending on your choice here, certain other properties are either mandatory or are not permitted.
|iconUrl     | String      | A URL pointing to an icon to display in the notification.
|title       | String      | The notification's title.
|message     | String      | The notification's main content.

### Example

```javascript
var notifId = null;

broxjs.notification.create({title: 'this is a title', message: 'this is a message'})
  .then( notif => {
    return notif.update(notifId, {title: 'this is a new title'});
  })
  .then(notif => notif.close());
```

## Event

```
onClosed
onClicked
onButtonClicked
```

## Example

```javascript
broxjs.notification.addEventListener('closed', function (notif) {
  console.log('notif with id ', notif.id, 'is closed');
});
```
