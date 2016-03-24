'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ctx) {
  return function (event) {
    if (event.name !== 'sayHello') {
      return Promise.reject(new Error('Only sayHello events are allowed'));
    }
    ctx.api.logger.trace('hello ' + (event.data.name || 'john') + '!');
    return Promise.resolve(ctx);
  };
};