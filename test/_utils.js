'use strict';

import jsdom from 'jsdom';

// instantiates a basic DOM
const createDOM = html => {
  return new Promise((resolve, reject) => {
    jsdom.env(html, (err, window) => {
      if (err) {
        return reject(err);
      }
      resolve(window);
    });
  });
};

// instantiates a simple counter
const createCounter = (fn, logs) => {
  // push mssages into an array in order to assert
  const logger = { trace: str => logs.push(str) };
  const counter = fn({
    vars: {},
    api: { logger: logger }
  });
  return counter;
};

export default {
  createDOM: createDOM,
  createCounter: createCounter
};
