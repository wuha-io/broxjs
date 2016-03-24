'use strict';

export default ctx => {
  return event => {
    let span = ctx.window.document.querySelector('#name');
    span.textContent = event.data.name;
    return Promise.resolve(ctx);
  };
};
