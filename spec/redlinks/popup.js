'use strict';

/*import DOM from 'broxjs-dom';
import PopupContext from 'broxjs-popup-context';
import Logger from 'broxjs-logger';
import messaging from 'broxjs-messaging';*/

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
  changeBtnStyle: (btn, style, value) => { btn.style[style] = value; },
  makeBtnBold: btn => { changeBtnStyle(btn, 'fontWeight', 'bold'); },
  unmakeBtnBold: btn => { changeBtnStyle(btn, 'fontWeight', 'normal'); },
  makeLinksRed: btn => messaging.send('makeLinksRed')
    .then(() => { makeBtnBold(btn); })
    .catch(err => {
      logger.error(err);
      unmakeBtnBold(btn);
    });
};

export { Popup, _ };

export default (ctx, event) => {
  'use strict';

  let btn = ctx.window.document.querySelector('#clickme');
  let url = ctx.window.document.querySelector('#url');

  context.inRed ? _.makeBtnBold(btn) : _.unmakeBtnBold(btn);
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
