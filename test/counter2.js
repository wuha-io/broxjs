'use strict';

import should from 'should';
import utils from './_utils';
import counter2 from '../src/counter2';

const createCounter = logs => utils.createCounter(counter2, logs);

describe('Counter 2', () => {

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
