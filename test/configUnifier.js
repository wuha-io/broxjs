'use strict';

import should from 'should';
import lodash from 'lodash';
import configUnifier from '../src/configUnifier';

describe('Config Unifier', () => {

  describe('Item', () => {

    it('should throw type error #1', () => {

      configUnifier(null, { manifest_version: 'string' }, 'My extension'); // no error expected

      (() => configUnifier(null, { manifest_version: { type: 'number' } }, 'My extension'))
        .should.throw('Field "manifest_version" has an invalid number value');
    });

    it('should throw type error #2', () => {

      configUnifier(null, { manifest_version: { type: 'number[]' } }, [ 1, 2, 3 ]); // no error expected

      (() => configUnifier(null, { manifest_version: { type: 'number[]' } }, [ 'My extension' ]))
        .should.throw('Field "manifest_version" has an invalid number[] value');
    });

    it('should throw required error', () => {

      [ null, undefined ].forEach(invalidValue => {
        (() => configUnifier(null, { name: { required: true } }, invalidValue))
          .should.throw('Field "name" is required');
      });
    });

    it('should be mapped - simple', () => {

      const mapping = {
        name: {
          mapping: {
            chrome: 'chromeFieldName'
          }
        }
      };

      const item = configUnifier('chrome', mapping, 'My extension');
      item.should.have.property('chromeFieldName', 'My extension');
    });

    it('should be mapped - deep', () => {

      const mapping = {
        ext_info: {
          mapping: {
            chrome: 'metadata'
          },
          children: {
            description: 'string',
            version: {
              //required: true,
              mapping: {
                chrome: 'ext_version'
              },
              children: {
                manifest: {
                  type: 'number',
                  required: true
                }
              }
            }
          }
        }
      };

      const config = {
        description: 'Some description',
        version: {
          manifest: 42
        }
      };

      const expectedConfig = {
        metadata: {
          description: config.description,
          ext_version: config.version
        }
      };

      const item = configUnifier('chrome', mapping, config);
      JSON.stringify(item).should.be.equal(JSON.stringify(expectedConfig));
    });

  });

});
