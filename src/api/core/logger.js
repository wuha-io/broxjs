'use strict';

import util from 'util';

export const LEVEL = {
  DEBUG: 0,
  INFO: 1,
  ERROR: 2
};

export class CoreLogger {

  constructor(level, stdout) {
    this.level = level;
    this.stdout = stdout;
  }

  static build_(message, ...vars) {
    return message;
  }

  log_(level, message) {
    if (level >= this.level) {
      this.stdout(message);
      return message;
    }
  }

  debug(message, ...vars) {
    return this.log_(LEVEL.DEBUG, CoreLogger.build_(message, vars));
  }

  info(message, ...vars) {
    return this.log_(LEVEL.INFO, CoreLogger.build_(message, vars));
  }

  error(message, ...vars) {
    return this.log_(LEVEL.ERROR, CoreLogger.build_(message, vars));
  }

};
