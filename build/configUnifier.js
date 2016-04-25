'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeError = function typeError(key, type) {
  return new Error('Field "' + key + '" has an invalid ' + type + ' value');
};

var unify = function unify(platform, mapping, value) {

  // avoid the null key
  platform = platform || 'unknown';

  // the config item parameter name (ex: 'version')
  var itemKey = Object.keys(mapping).shift();

  // the item mapping
  var itemMapping = mapping[itemKey];

  // 'string' => { type: 'string' }
  if (typeof itemMapping === 'string') {
    itemMapping = { type: itemMapping };
  }

  var childrenKeys = itemMapping.children ? Object.keys(itemMapping.children) : [];

  // required field constraint
  if (itemMapping.required === true && (value === null || value === undefined)) {
    throw new Error('Field "' + itemKey + '" is required');
  }

  // default type
  if (!itemMapping.type) {
    itemMapping.type = !itemMapping.children ? 'string' : 'object';
  }

  // ex: 'number[]'
  var isArrayType = itemMapping.type.substr(itemMapping.type.length - 2) === '[]';
  if (isArrayType) {
    itemMapping.type = itemMapping.type.substr(0, itemMapping.type.length - 2);
    if (!Array.isArray(value)) {
      throw typeError(itemKey, itemMapping.type);
    } else {
      // more than one type or invalid type
      var types = value.reduce(function (acc, v) {
        return acc.concat(typeof v === 'undefined' ? 'undefined' : _typeof(v));
      }, []).filter(function (v, i, arr) {
        return arr.indexOf(v) === i;
      });
      if (!(types.length === 1 && types.shift() === itemMapping.type)) {
        throw typeError(itemKey, itemMapping.type + '[]');
      }
    }
  } else if (itemMapping.type !== (typeof value === 'undefined' ? 'undefined' : _typeof(value))) {
    throw typeError(itemKey, itemMapping.type);
  }

  // default mapping
  if (!itemMapping.mapping) {
    itemMapping.mapping = {};
  }
  if (!itemMapping.mapping[platform]) {
    itemMapping.mapping[platform] = itemKey;
  }

  var outItem = {};
  var mappingName = itemMapping.mapping[platform];

  // recursive call
  if (childrenKeys.length) {

    outItem[mappingName] = {};

    childrenKeys.forEach(function (childKey) {

      var childMapping = {};
      childMapping[childKey] = itemMapping.children[childKey];

      var childOut = unify(platform, childMapping, value[childKey]);
      outItem[mappingName] = _lodash2.default.merge(outItem[mappingName], childOut);
    });
  } else {
    outItem[mappingName] = value;
  }

  return outItem;
};

exports.default = unify;