'use strict';

import DOM from 'broxjs-dom';
import PopupContext from 'broxjs-popup-context';
import Logger from 'broxjs-logger';
import messaging from 'broxjs-messaging';

const logger = new Logger();

class Popup extends PopupContext {

  construct() {
    this.window = null;
    this.properties = [];
    this.inRed = false;
    this.url = null;
  }

}

const _ = {
  changeBtnStyle: (btn, style, value) => btn.style[style] = value,
  makeBtnBold: btn => _.changeBtnStyle(btn, 'fontWeight', 'bold'),
  unmakeBtnBold: btn => _.changeBtnStyle(btn, 'fontWeight', 'normal'),
  makeLinksRed: btn => messaging.send('makeLinksRed')
    .then(() => _.makeBtnBold(btn))
    .catch(err => {
      logger.error(err);
      _.unmakeBtnBold(btn);
    })
};

export { Popup, _ };

export default (ctx, event) => {

  let btn = ctx.window.document.querySelector('#clickme');
  let url = ctx.window.document.querySelector('#url');

  if (ctx.inRed) {
    _.makeBtnBold(btn);
  } else {
    _.unmakeBtnBold(btn);
  }

  url.innerText = ctx.url;

  if (event.source === btn && event.name === 'click') {
    return new Promise((resolve, reject) => {
      _.makeLinksRed(btn)
        .then(() => resolve(ctx))
        .catch(reject);
    });
  }

  return ctx;
};
