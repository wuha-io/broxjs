'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ctx) {
  return function (event) {
    ctx.vars.counter = (ctx.vars.counter || 0) + 1;
    return Promise.resolve(ctx);
  };
};