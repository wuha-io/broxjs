'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ctx) {
  return function (event) {
    var span = ctx.window.document.querySelector('#name');
    span.textContent = event.data.name;
    return Promise.resolve(ctx);
  };
};