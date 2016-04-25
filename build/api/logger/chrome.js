'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../core/logger');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Logger = function (_CoreLogger) {
  _inherits(Logger, _CoreLogger);

  function Logger() {
    _classCallCheck(this, Logger);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Logger).apply(this, arguments));
  }

  return Logger;
}(_logger.CoreLogger);

exports.default = Logger;