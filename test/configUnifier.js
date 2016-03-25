'use strict';

import should from 'should';
import lodash from 'lodash';
import configUnifier from '../src/configUnifier';

describe('Config Unifier', () => {

  describe('Item', () => {

    it('should throw type error', () => {
      (() => configUnifier.item(null, { type: 'number' }, { name: 'My extension' }))
        .should.throw('Field "name" has an invalid number value');
    });

    it('should throw required error', () => {
      const configItem = { name: null };
      (() => configUnifier.item(null, { required: true }, configItem))
        .should.throw('Field "name" is required');
    });

    it('should be mapped', () => {
      const mapping = { type: 'string', map: { chrome: 'chromeFieldName' } };
      const item = configUnifier.item('chrome', mapping, { name: 'My extension' });
      item.should.have.property('chromeFieldName', 'My extension');
    });

  });

});
