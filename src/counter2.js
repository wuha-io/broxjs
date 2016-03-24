'use strict';

export default ctx => {
  return event => {
    if (event.name !== 'sayHello') {
      return Promise.reject(new Error('Only sayHello events are allowed'));
    }
    ctx.api.logger.trace('hello ' + (event.data.name || 'john') + '!');
    return Promise.resolve(ctx);
  };
};
