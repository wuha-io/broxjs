'use strict';

import should from 'should';
import counter2 from '../src/counter2';

describe('Counter background', () => {

  const createCounter = logs => {
    const logger = { trace: str => logs.push(str) };
    const counter = counter2({
      vars: {},
      api: { logger: logger }
    });
    return counter;
  };

  const createEvent = name => {
    return {name: name, data: {}};
  };

  let logs, counter, event;

  it('should only accept sayHello events', done => {
    logs = [];
    counter = createCounter(logs);
    event = createEvent('click');
    counter(event).catch(err => {
      logs.length.should.equal(0);
      err.message.should.equal('Only sayHello events are allowed');
      done();
    });
  });

  it('should say hello john if no name given', done => {
    logs = [];
    counter = createCounter(logs);
    event = createEvent('sayHello');
    counter(event).then(() => {
      logs.length.should.equal(1);
      logs.shift().should.equal('hello john!');
      event.data.name = 'brice';
      done();
    });
  });

  it('should say hello to me', done => {
    logs = [];
    counter = createCounter(logs);
    event = createEvent('sayHello');
    event.data.name = 'brice';
    counter(event).then(() => {
      logs.length.should.equal(1);
      logs.shift().should.equal('hello brice!');
      done();
    });
  });

});
