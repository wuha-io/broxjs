'use strict';

export default ctx => {
  return event => {
    ctx.vars.counter = (ctx.vars.counter || 0) + 1;
    return Promise.resolve(ctx);
  };
};
