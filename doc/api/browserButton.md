
# API : browserButton


## Manifest

To use this API you need :

```json
{
  "name": "My extension",
  ...
  "browser_action": {
    "default_icon": {                    // optional
      "19": "images/icon19.png",           // optional
      "38": "images/icon38.png"            // optional
    },
    "default_title": "My extension",      // optional; shown in tooltip
    "default_popup": "popup.html"        // optional
  }
}
```

## Method

```javascript
title()
icon()
popup()
badgeText()
backgroundColor()
```

### Example

```javascript
broxjs.browserButton.title().then( title => {
  if(title != 'bonjour') return broxjs.browserButton.title('coucou');
})
```

## Event

```javascript
onClicked
```

### Example

```javascript
broxjs.browserButton.onClicked(function (tab) {
  console.log('button clicked');
});
```
