#!/usr/bin/env node

'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _gitConfig = require('git-config');

var _gitConfig2 = _interopRequireDefault(_gitConfig);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _yesno = require('yesno');

var _yesno2 = _interopRequireDefault(_yesno);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BROXJS_DIR = '/usr/local/lib/node_modules/broxjs';
var TPL_DIR = BROXJS_DIR + '/template';

var pkg = require(__dirname + '/../../package.json');

_commander2.default.version(pkg.version).option('-p, --pack', 'Pack the Extension').parse(process.argv);

var currentDir = process.cwd();
var projectName = (_commander2.default.args || []).shift();
if (projectName) {
  currentDir += '/' + projectName;
  _fsExtra2.default.mkdirsSync(currentDir);
  process.chdir(currentDir);
}

var error = function error(err) {
  console.error(err);
  process.exit(1);
};

var init = function init() {
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

      var copyOperation = function copyOperation(srcFile, dstFile) {
        return operations.push(function (cbk) {
          return _fsExtra2.default.copy(srcFile, dstFile, cbk);
        });
      };
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
      writeJsonOperation(currentDir + '/extension.json', extInfos);

      var npm = require(TPL_DIR + '/package.json');
      npm.name = result.shortName;
      npm.version = result.version;
      npm.description = result.description;
      if (result.repository) npm.repository = result.repository;
      writeJsonOperation(currentDir + '/package.json', npm);

      var bower = require(TPL_DIR + '/bower.json');
      bower.name = result.shortName;
      bower.authors.push(result.author);
      writeJsonOperation(currentDir + '/bower.json', bower);

      ['babelrc', 'bowerrc', 'editorconfig', 'gitattributes', 'gitignore', 'jshintrc'].forEach(function (file) {
        return copyOperation(TPL_DIR + '/' + file, currentDir + '/.' + file);
      });

      ['assets/', 'src/', 'test/', 'views/'].concat(['LICENSE', 'README.md']).concat(['gulpfile.babel.js']).forEach(function (file) {
        return copyOperation(TPL_DIR + '/' + file, currentDir + '/' + file);
      });

      var installDeps = void 0;
      operations.push(function (cbk) {
        return _yesno2.default.ask('\nDo you you to install npm/bower dependencies? (Y/n)'.bold.yellow, true, function (res) {
          installDeps = res;
          cbk();
        });
      });

      operations.push(function (cbk) {
        if (!installDeps) return cbk();
        console.log('\nInstalling dependencies...'.bold.red);
        _child_process2.default.exec('npm i && bower i', cbk);
      });

      _async2.default.series(operations, function (err, results) {
        if (err) return error(err);
        console.log('\nCongralutions! Your extension is ready'.bold.green);
        _prompt2.default.stop();
      });
    });
  });
};

var pack = function pack() {
  console.log('\nPacking...'.bold.yellow);

  var configMapping = require(BROXJS_DIR + '/doc/manifest.mapping.json');
  var extInfos = require(currentDir + '/extension.json');

  console.log(_index2.default.configUnifier('chrome', configMapping, extInfos));
};

if (_commander2.default.pack) pack();else init();