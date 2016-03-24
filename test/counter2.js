'use strict';

import should from 'should';
import counter2 from '../src/counter2';

describe('Counters', () => {

  // instantiates a simple counter2
  const createCounter = logs => {
    // push mssages into an array in order to assert
    const logger = { trace: str => logs.push(str) };
    const counter = counter2({
      vars: {},
      api: { logger: logger }
    });
    return counter;
  };

  it('should only accept sayHello events', done => {
    let logs = [];
    const counter = createCounter(logs);
    const event = { name: 'click' };
    counter(event).catch(err => {
      logs.length.should.equal(0);
      err.message.should.equal('Only sayHello events are allowed');
      done();
    });
  });

  it('should say hello john if no name given', done => {
    let logs = [];
    const counter = createCounter(logs);
    const event = { name: 'sayHello', data: {} };
    counter(event).then(() => {
      logs.length.should.equal(1);
      logs.shift().should.equal('hello john!');
      event.data.name = 'brice';
      done();
    });
  });

  it('should say hello to me', done => {
    let logs = [];
    const counter = createCounter(logs);
    const event = { name: 'sayHello', data: { name: 'brice' } };
    counter(event).then(() => {
      logs.length.should.equal(1);
      logs.shift().should.equal('hello brice!');
      done();
    });
  });

});
