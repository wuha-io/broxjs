'use strict';

import should from 'should';
import lodash from 'lodash';
import { LEVEL, CoreLogger } from '../../../src/api/core/logger';

describe('Core Logger', () => {

  it('should format', () => {
    const logs = [];
    const addLog = log => logs.push(log);
    const logger = new CoreLogger(LEVEL.INFO, addLog);
    should.not.exists(logger.debug('Hello debug'));
    logger.info('Hello info').should.equal('Hello info');
    logger.error('Hello error').should.equal('Hello error');
    //TODO logger.info('Hello %s!', 'brice').should.equal('Hello brice!');
  });

});
