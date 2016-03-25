'use strict';

import should from 'should';
import lodash from 'lodash';
import configGenerator from '../src/configGenerator';

describe('Config generator', () => {

  describe('Simple config item', () => {

    it('should throw type error', () => {
      (() => configGenerator.item(null, { type: 'number' }, { name: 'My extension' }))
        .should.throw('Field "name" has an invalid number value');
    });

    it('should map', () => {
      const mapping = { type: 'string', map: { chrome: 'chromeFieldName' } };
      const item = configGenerator.item('chrome', mapping, { name: 'My extension' });
      item.should.have.property('chromeFieldName', 'My extension');
    });

    it('should throw required error', () => {
      const configItem = { name: null };
      (() => configGenerator.item(null, { required: true }, configItem))
        .should.throw('Field "name" is required');
    });

  });

});
