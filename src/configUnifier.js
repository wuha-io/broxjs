'use strict';

import lodash from 'lodash';

const typeError = (key, type) => new Error('Field "' + key + '" has an invalid ' + type + ' value');

const unify = (platform, mapping, value) => {

  // avoid the null key
  platform = platform || 'unknown';

  // the config item parameter name (ex: 'version')
  const itemKey = Object.keys(mapping).shift();

  // the item mapping
  let itemMapping = mapping[itemKey];

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
  const isArrayType = itemMapping.type.substr(itemMapping.type.length - 2) === '[]';
  if (isArrayType) {
    itemMapping.type = itemMapping.type.substr(0, itemMapping.type.length - 2);
    if (!Array.isArray(value)) {
      throw typeError(itemKey, itemMapping.type);
    } else {
      // more than one type or invalid type
      var types = value.reduce((acc, v) => acc.concat(typeof v), [])
        .filter((v, i, arr) => arr.indexOf(v) === i);
      if (!(types.length === 1 && types.shift() === itemMapping.type)) {
        throw typeError(itemKey, itemMapping.type + '[]');
      }
    }
  } else if (itemMapping.type !== typeof value) {
    throw typeError(itemKey, itemMapping.type);
  }

  // default mapping
  if (!itemMapping.mapping) {
    itemMapping.mapping = {};
  }
  if (!itemMapping.mapping[platform]) {
    itemMapping.mapping[platform] = itemKey;
  }

  let outItem = {};
  var mappingName = itemMapping.mapping[platform];

  // recursive call
  if (childrenKeys.length) {

    outItem[mappingName] = {};

    childrenKeys.forEach(childKey => {

      const childMapping = {};
      childMapping[childKey] = itemMapping.children[childKey];

      const childOut = unify(platform, childMapping, value[childKey]);
      outItem[mappingName] = lodash.merge(outItem[mappingName], childOut);
    });

  } else {
    outItem[mappingName] = value;
  }

  return outItem;
};

export default unify;
