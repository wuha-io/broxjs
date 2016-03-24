'use strict';

import should from 'should';
import counter1 from '../src/counter1';

describe('Counter 1', () => {

  it('should increment a counter', done => {
    const counter = counter1({vars: {counter: 0}});
    counter().then(counter).then(ctx => {
      ctx.vars.counter.should.equal(2);
      done();
    }).catch(done);
  });

});
