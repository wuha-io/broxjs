'use strict';

import should from 'should';
import utils from './_utils';
import popup1 from '../src/popup1';

describe('Popup 1', () => {

  const DEFAULT_HTML = '<hml>' +
  '  <head></head>'
  + '  <body>'
  + '    <p id="name">sacha</p>'
  + '  </body>'
  + '</html>';

  //TODO we need to think about how to go to the other side
  it('should set a name into #name node', done => {
    utils.createDOM(DEFAULT_HTML).then(window => {
      const popup = popup1({ window: window });
      return popup({ data: { name: 'brice' } }).then(ctx => {
        let span = ctx.window.document.querySelector('#name');
        span.outerHTML.should.equal('<p id="name">brice</p>');
        done();
      });
    }).catch(done);
  });

});
