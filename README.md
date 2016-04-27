
# Brox.js

[![NPM Version][npm-image]][npm-url]

:warning: **CURRENTLY IN SPECIFICATION** :warning:

**Goal:** Think about and build a pure JavaScript Browser Extension Framework.

Available Gulp commands :

```bash
gulp pre-clean # clean build/
gulp compile # es6 -> es5
gulp jshint # check code syntax
gulp test # run the test (directly in es6)
gulp build # jshint, test, pre-clean and compile
gulp # (default - for development) watch and build / run tests

# To install globally (update binaries)
sudo npm i -g .
```

## [TODO](https://github.com/wuha-io/broxjs/blob/master/TODO.md)

## [Configuration Unifier](https://github.com/wuha-io/broxjs/blob/master/doc/configUnifier.md)

# API

- [logger](https://github.com/wuha-io/broxjs/blob/dev/doc/api/logger.md)
- [notification](https://github.com/wuha-io/broxjs/blob/dev/doc/api/notification.md)
- [browserButton](https://github.com/wuha-io/broxjs/blob/dev/doc/api/browserButton.md)
- [alarms](https://github.com/wuha-io/broxjs/blob/dev/doc/api/alarms.md)

## Others

- [Chrome documentation](https://developer.chrome.com/extensions/api_index)
- [Firefox documentation](https://developer.mozilla.org/en-US/Add-ons)

## [MIT Licence](https://github.com/wuha-io/broxjs/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/express.svg
[npm-url]: https://www.npmjs.com/package/broxjs
