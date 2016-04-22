
# API : Notification

## Method

```
create(id, options, function(id) { ... })
update()
clear()
getAll()
```

## Options
|List of all options|Value|Description
|:-|:-|:-|
|type        | basic / image / list / progress | The type of notification you want.<br> Depending on your choice here, certain other properties are either mandatory or are not permitted.
|iconUrl     | String      | A URL pointing to an icon to display in the notification.
|title       | String      | The notification's title.
|message     | String      | The notification's main content.

---

###### Optional

|List of all options|Value|Description
|:-|:-|:-|
|contextMessage  | String  | Supplementary content to display.
|priority        | Numer   |
|eventTime       | Number  |
|buttons         | 
|imageUrl        |
|items           |
|progress        |


## Event

```
onClosed
onClicked
onButtonClicked
```

## Example

```javascript

```
