#!/usr/bin/env node

'use strict';

var _yesno = require('yesno');

var _yesno2 = _interopRequireDefault(_yesno);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yesno2.default.ask('Are you sure you want to continue?', true, console.log.bind(console));