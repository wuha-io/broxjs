'use strict';

import lodash from 'lodash';

const item = (platform, itemMapping, srcItem) => {
  const itemKey = Object.keys(srcItem).shift();
  const itemValue = srcItem[itemKey];
  if (itemMapping.required && (itemValue === null || itemValue === undefined)) {
    throw new Error('Field "' + itemKey + '" is required');
  }
  if (itemMapping.type !== typeof itemValue) {
    throw new Error('Field "' + itemKey + '" has an invalid ' + itemMapping.type + ' value');
  }
  const outItem = {};
  outItem[itemMapping.map[platform]] = itemValue;
  return outItem;
};

export default {
  item: item
};
