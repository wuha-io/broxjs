#!/usr/bin/env node

'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _gitConfig = require('git-config');

var _gitConfig2 = _interopRequireDefault(_gitConfig);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      shortName: {
        message: 'Extension\'s short name',
        default: 'my-extension',
        required: true
      },
      version: {
        message: 'Starting version',
        default: '0.1.0',
        required: true
      },
      repository: {
        message: 'CVS repository'
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

  _prompt2.default.message = 'Broxjs'.bold.yellow;
  _prompt2.default.start();

  console.log();

  _prompt2.default.get(schema, function (err, result) {

    if (err) return error(err);

    var operations = [];
    var writeJsonOperation = function writeJsonOperation(file, obj) {
      return operations.push(function (cbk) {
        return _fsExtra2.default.writeJson(file, obj, { spaces: 2 }, cbk);
      });
    };

    var extInfos = require(TPL_DIR + '/extension.json');
    extInfos.name = extInfos.browser_action.default_title = result.name;
    extInfos.version = result.version;
    extInfos.author = result.author;
    extInfos.description = result.description;
    extInfos.extension_url = result.homepageURL;
    extInfos.update_url = result.homepageURL + '/update';
    writeJsonOperation(CUR_DIR + '/extension.json', extInfos);

    var npm = require(TPL_DIR + '/package.json');
    npm.name = result.shortName;
    npm.version = result.version;
    npm.description = result.description;
    if (result.repository) npm.repository = result.repository;
    writeJsonOperation(CUR_DIR + '/package.json', npm);

    var bower = require(TPL_DIR + '/bower.json');
    bower.name = result.shortName;
    bower.authors.push(result.author);
    writeJsonOperation(CUR_DIR + '/bower.json', bower);

    ['assets/', 'src/', 'test/', 'views/'].concat(['.babelrc', '.bowerrc', '.editorconfig', '.gitattributes', '.gitignore', '.jshintrc']).concat(['LICENSE', 'README.md']).concat(['gulpfile.babel.js']).forEach(function (file) {
      return operations.push(function (cbk) {
        return _fsExtra2.default.copy(TPL_DIR + '/' + file, CUR_DIR, cbk);
      });
    });

    _async2.default.parallel(operations, function (err, results) {

      if (err) return error(err);

      console.log('\nCongralutions! Your extension is ready, please...'.bold.green);
    });
  });
});