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

var _singleLineLog = require('single-line-log');

var _singleLineLog2 = _interopRequireDefault(_singleLineLog);

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _zipFolder = require('zip-folder');

var _zipFolder2 = _interopRequireDefault(_zipFolder);

var _xml2json = require('xml2json');

var _xml2json2 = _interopRequireDefault(_xml2json);

var _prettyData = require('pretty-data');

var _prettyData2 = _interopRequireDefault(_prettyData);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BROXJS_DIR = '/usr/local/lib/node_modules/broxjs';
var TPL_DIR = BROXJS_DIR + '/template';
var NAVIGATOR = ['chrome', 'firefox'];
var NAV_OUT_ZIP = {
  'chrome': 'crx',
  'firefox': 'xpi'
};
var pkg = require(__dirname + '/../../package.json');
var PACKAGE = {};
var EXTENSION = {};

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

var animeLogI = 0;
var log = _singleLineLog2.default.stdout;
var animeLog = function animeLog() {
  log.clear();
  var temp = '';
  var i = 0;
  while (i < animeLogI) {
    temp = temp + '    ';
    i = i + 1;
  }
  var last = '';
  switch (animeLogI % 2) {
    case 0:
      last = '   ]\\_  \n';
      break;
    default:
      last = '   /_[  \n';
  }
  log(temp + '      MM \n' + temp + '|\\___/ `>\n' + temp + ' \\_  _/ \n' + temp + last);
  animeLogI = animeLogI + 1;
  if (animeLogI >= 5) {
    animeLogI = 0;
  }
};

var init = function init() {
  (0, _gitConfig2.default)(function (err, gconfig) {

    var user = gconfig.user.name || 'John Doe';
    var email = gconfig.user.email || 'johndoe@iap.com';

    var schema = {
      properties: {
        "filesaverjs": "^0.2.2",
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

      ['babelrc', 'bowerrc', 'editorconfig', 'gitattributes', 'gitignore', 'jshintrc', 'broxrc'].forEach(function (file) {
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
        var npmi = _child_process2.default.exec('npm i && bower i');
        var animate = setInterval(animeLog, 400);
        npmi.on('close', function (code) {
          clearInterval(animate);
          cbk();
        });
        npmi.on('error', function (err) {
          cbk(err);
        });
      });

      _async2.default.series(operations, function (err, results) {
        if (err) return error(err);
        console.log('\nCongralutions! Your extension is ready\n'.bold.green);
        _prompt2.default.stop();
      });
    });
  });
};

var createHTML = function createHTML(file) {
  return new Promise(function (resolve, reject) {
    var nameFile = file.split('.');
    var ext = nameFile.pop();
    if (ext !== 'jade') {
      console.log(file + ' ignored');
      return resolve({ ignored: true });
    }
    var html = _pug2.default.renderFile('./views/' + file, { pretty: true });
    resolve({ html: html, file: nameFile.join('.') + '.html' });
  });
};

var writeHTML = function writeHTML(dir, html) {
  return new Promise(function (resolve, reject) {
    return _fsExtra2.default.outputFile(dir, html, function (err) {
      if (err) return reject();
      return resolve();
    });
  });
};

var logInfo = function logInfo(nav, string) {
  var t = '[' + nav + ']';
  console.log(t.bold.blue, string);
};

var copyFileP = function copyFileP(src, target, nav, string) {
  return new Promise(function (resolve, reject) {
    return _fsExtra2.default.copy(src, target, function (err) {
      if (err) return reject();
      logInfo(nav, string);
      return resolve();
    });
  });
};

var parseViews = function parseViews() {
  return new Promise(function (resolve, reject) {
    _fsExtra2.default.readdir('./views', function (err, files) {
      var render = [];
      files.forEach(function (val) {
        render.push(createHTML(val));
      });
      return Promise.all(render).then(function (r) {
        var html = [];
        r.forEach(function (val) {
          if (val.ignored) {
            return;
          }
          NAVIGATOR.forEach(function (nav) {
            html.push(writeHTML('./output/' + nav + '/views/' + val.file, val.html));
            logInfo(nav, 'views/' + val.file);
          });
        });
        return Promise.all(html).then(resolve);
      }).catch(reject);
    });
  });
};

var zipFolderP = function zipFolderP(src, target) {
  return new Promise(function (resolve, reject) {
    (0, _zipFolder2.default)(src, target, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

var zip = function zip() {
  return new Promise(function (resolve, reject) {
    var pro = [];
    NAVIGATOR.forEach(function (val) {
      if (val === 'chrome') {
        pro.push(zipFolderP('./output/' + val, './output/' + PACKAGE.name + '_' + PACKAGE.version + '_webstore' + '.zip'));
      }
      pro.push(zipFolderP('./output/' + val, './output/' + PACKAGE.name + '_' + PACKAGE.version + '.' + NAV_OUT_ZIP[val]));
    });
    Promise.all(pro).then(function () {
      logInfo('All', 'Zip OK!');
      resolve();
    }).catch(console.error);
  });
};

var fileUpdateChrome = function fileUpdateChrome() {
  return new Promise(function (resolve, reject) {
    _fsExtra2.default.readFile(TPL_DIR + '/update/update_chrome.xml', function (err, data) {
      var json = _xml2json2.default.toJson(data, { object: true, coerce: true, reversible: true });
      json.gupdate.app.appid = 'une_appid_recup_du_fichier';
      json.gupdate.app.updatecheck.codebase = EXTENSION.update_url;
      json.gupdate.app.updatecheck.version = PACKAGE.version;
      var xml = '<?xml version="1.0" encoding="utf-8"?>';
      xml = xml + _xml2json2.default.toXml(json);
      xml = _prettyData2.default.pd.xml(xml);
      _fsExtra2.default.writeFile('./output/update_chrome.xml', xml, function (err) {
        if (err) {
          return reject(err);
        }
        logInfo('chrome', 'Update xml create.');
        resolve();
      });
    });
  });
};

var fileUpdateFirefox = function fileUpdateFirefox() {
  return new Promise(function (resolve, reject) {
    _fsExtra2.default.readFile(TPL_DIR + '/update/update_firefox.xml', function (err, data) {
      var json = _xml2json2.default.toJson(data, { object: true, coerce: true, reversible: true });
      json['RDF:RDF']['RDF:Description']['em:updates']['RDF:Seq']['RDF:li']['RDF:Description']['em:version'].$t = PACKAGE.version;
      json['RDF:RDF']['RDF:Description']['em:updates']['RDF:Seq']['RDF:li']['RDF:Description']['em:targetApplication']['RDF:Description']['em:id'].$t = '{une_appid_recup_du_fichier}';
      json['RDF:RDF']['RDF:Description']['em:updates']['RDF:Seq']['RDF:li']['RDF:Description']['em:targetApplication']['RDF:Description']['em:updateLink'].$t = EXTENSION.update_url;
      json['RDF:RDF']['RDF:Description']['em:version'].$t = PACKAGE.version;
      json['RDF:RDF']['RDF:Description']['em:updateLink'].$t = EXTENSION.update_url;
      var xml = '<?xml version="1.0" encoding="utf-8"?>';
      xml = xml + _xml2json2.default.toXml(json);
      xml = _prettyData2.default.pd.xml(xml);
      _fsExtra2.default.writeFile('./output/update_firefox.xml', xml, function (err) {
        if (err) {
          return reject(err);
        }
        logInfo('firefox', 'Update xml create.');
        resolve();
      });
    });
  });
};

var pack = function pack() {

  _fsExtra2.default.readJson('./package.json', function (err, data) {
    PACKAGE = data;
  });

  _fsExtra2.default.readJson('./extension.json', function (err, data) {
    EXTENSION = data;
  });

  console.log('\nPacking...\n'.bold.yellow);
  console.log('           ((\\o/))\n'.cyan + '.-----------//^\\\\-----------.\n'.cyan + '|          /`| |`\\_______   |\n'.cyan + '|            | |  |BroxJS|  |\n'.cyan + '|            | |  """"""""  |\n'.cyan + '|            | |            |\n'.cyan + '\'------------===------------\'\n'.cyan);
  /*const configMapping = require(BROXJS_DIR + '/doc/manifest.mapping.json');
  const extInfos = require(currentDir + '/extension.json');
  console.log(broxjs.configUnifier('chrome', configMapping, extInfos));*/

  var pro = [];

  NAVIGATOR.forEach(function (val) {
    pro.push(copyFileP('./assets', './output/' + val + '/assets', val, 'Assets has been copied'));
    pro.push(copyFileP('./src', './output/' + val + '/src', val, 'Source has been copied'));
  });
  pro.push(parseViews());
  pro.push(fileUpdateChrome());
  pro.push(fileUpdateFirefox());

  Promise.all(pro).then(zip).then(function () {
    console.log('\nPacking completed\n'.bold.green);
  }).catch(console.error);
};

if (_commander2.default.pack) _fsExtra2.default.stat('./.broxrc', function (err, stat) {
  if (err) {
    return console.log('\nYou are not in project directory!\n'.bold.red);
  }
  pack();
});else init();