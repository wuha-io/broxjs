'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreLogger = exports.LEVEL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LEVEL = exports.LEVEL = { DEBUG: 0, INFO: 1, ERROR: 2 };

var CoreLogger = exports.CoreLogger = function () {
  function CoreLogger(level, stdout) {
    _classCallCheck(this, CoreLogger);

    this.level = level;
    this.stdout = stdout;
  }

  _createClass(CoreLogger, [{
    key: 'log_',
    value: function log_(level, message) {
      if (level >= this.level) {
        this.stdout(message);
        return message;
      }
    }
  }, {
    key: 'debug',
    value: function debug(message) {
      for (var _len = arguments.length, vars = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        vars[_key - 1] = arguments[_key];
      }

      return this.log_(LEVEL.DEBUG, CoreLogger.build_(message, vars));
    }
  }, {
    key: 'info',
    value: function info(message) {
      for (var _len2 = arguments.length, vars = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        vars[_key2 - 1] = arguments[_key2];
      }

      return this.log_(LEVEL.INFO, CoreLogger.build_(message, vars));
    }
  }, {
    key: 'error',
    value: function error(message) {
      for (var _len3 = arguments.length, vars = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        vars[_key3 - 1] = arguments[_key3];
      }

      return this.log_(LEVEL.ERROR, CoreLogger.build_(message, vars));
    }
  }], [{
    key: 'build_',
    value: function build_(message) {
      //TODO
      return message;
    }
  }]);

  return CoreLogger;
}();