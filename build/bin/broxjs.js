#!/usr/bin/env node

'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _gitConfig = require('git-config');

var _gitConfig2 = _interopRequireDefault(_gitConfig);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = _bluebird2.default.promisifyAll(require('fs-extra'));

var CUR_DIR = process.cwd();
var TPL_DIR = '/usr/local/lib/node_modules/broxjs/template';

var error = function error(err) {
  console.error(err);
  process.exit(1);
};

(0, _gitConfig2.default)(function (err, gconfig) {

  var user = gconfig.user.name || 'John Doe';
  var email = gconfig.user.email || 'johndoe@iap.com';

  var schema = {
    properties: {
      name: {
        message: 'Extension\'s name',
        default: 'My Extension',
        required: true
      },
      version: {
        message: 'Starting version',
        default: '0.1.0',
        required: true
      },
      author: {
        message: 'Author',
        default: user + ' <' + email + '>'
      },
      description: {
        message: 'Description',
        default: 'This is a default description.'
      },
      homepageURL: {
        message: 'Homepage URL'
      }
    }
  };

  _prompt2.default.message = _safe2.default.red('Broxjs');
  _prompt2.default.start();

  _prompt2.default.get(schema, function (err, result) {

    if (err) return error(err);

    var extInfos = require(TPL_DIR + '/extension.json');
    extInfos.name = extInfos.browser_action.default_title = result.name;
    extInfos.version = result.version;
    extInfos.author = result.author;
    extInfos.description = result.description;
    extInfos.extension_url = result.homepageURL;
    extInfos.update_url = result.homepageURL + '/update';

    //console.log(JSON.stringify(extInfos, null, 2));

    fs.writeJson(CUR_DIR + '/extension.json', extInfos, { spaces: 2 });
  });
});