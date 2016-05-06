#!/usr/bin/env node
'use strict';

import program from 'commander';
import fs from 'fs-extra';
import async from 'async';
import gitconfig from 'git-config';
import prompt from 'prompt';
import yesno from 'yesno';
import colors from 'colors';
import cproc from 'child_process';
import sllog from 'single-line-log';
import pug from 'pug';
import zipFolder from 'zip-folder';
import parser from 'xml2json';
import pd from 'pretty-data';

import broxjs from '../index';

const BROXJS_DIR = '/usr/local/lib/node_modules/broxjs';
const TPL_DIR = BROXJS_DIR + '/template';
const NAVIGATOR = ['chrome', 'firefox'];
const NAV_OUT_ZIP = {
  'chrome': 'crx',
  'firefox': 'xpi'
};
const pkg = require(__dirname + '/../../package.json');
let PACKAGE = {};
let EXTENSION = {};

program
  .version(pkg.version)
  .option('-p, --pack', 'Pack the Extension')
  .parse(process.argv);

let currentDir = process.cwd();
const projectName = (program.args || []).shift();
if (projectName) {
  currentDir += '/' + projectName;
  fs.mkdirsSync(currentDir);
  process.chdir(currentDir);
}

const error = err => {
  console.error(err);
  process.exit(1);
};

let animeLogI = 0;
let log  = sllog.stdout;
const animeLog = () => {
  log.clear();
  let temp = '';
  let i = 0;
  while(i < animeLogI) {
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
  log(temp + '      MM \n' +
      temp + '|\\___/ `>\n' +
      temp + ' \\_  _/ \n' +
      temp + last);
  animeLogI = animeLogI + 1;
  if(animeLogI >= 5) {
    animeLogI = 0;
  }
};

const init = () => {
  gitconfig((err, gconfig) => {

    const user = gconfig.user.name || 'John Doe';
    const email = gconfig.user.email || 'johndoe@iap.com';

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

    prompt.message = 'Broxjs'.bold.yellow;
    prompt.start();

    console.log();

    prompt.get(schema, (err, result) => {

      if (err) return error(err);

      const operations = [];

      const copyOperation = (srcFile, dstFile) => operations.push(cbk => fs.copy(srcFile, dstFile, cbk));
      const writeJsonOperation = (file, obj) => operations.push(cbk => fs.writeJson(file, obj, {spaces: 2}, cbk));

      const extInfos = require(TPL_DIR + '/extension.json');
      extInfos.name = extInfos.browser_action.default_title = result.name;
      extInfos.version = result.version;
      extInfos.author = result.author;
      extInfos.description = result.description;
      extInfos.extension_url = result.homepageURL;
      extInfos.update_url = result.homepageURL + '/update';
      writeJsonOperation(currentDir + '/extension.json', extInfos);

      const npm = require(TPL_DIR + '/package.json');
      npm.name = result.shortName;
      npm.version = result.version;
      npm.description = result.description;
      if (result.repository) npm.repository = result.repository;
      writeJsonOperation(currentDir + '/package.json', npm);

      const bower = require(TPL_DIR + '/bower.json');
      bower.name = result.shortName;
      bower.authors.push(result.author);
      writeJsonOperation(currentDir + '/bower.json', bower);

      [ 'babelrc', 'bowerrc', 'editorconfig', 'gitattributes', 'gitignore', 'jshintrc', 'broxrc' ]
        .forEach(file => copyOperation(TPL_DIR + '/' + file, currentDir + '/.' + file));

      [ 'assets/', 'src/', 'test/', 'views/' ]
        .concat([ 'LICENSE', 'README.md' ])
        .concat([ 'gulpfile.babel.js' ])
          .forEach(file => copyOperation(TPL_DIR + '/' + file, currentDir + '/' + file));

      let installDeps;
      operations.push(cbk => yesno.ask('\nDo you you to install npm/bower dependencies? (Y/n)'.bold.yellow, true, res => {
        installDeps = res;
        cbk();
      }));

      operations.push(cbk => {
        if (!installDeps)
          return cbk();
        console.log('\nInstalling dependencies...'.bold.red);
        let npmi = cproc.exec('npm i && bower i');
        let animate = setInterval(animeLog, 400);
        npmi.on('close', (code) => {
          clearInterval(animate);
          cbk();
        });
        npmi.on('error', (err) => {
          cbk(err);
        });
      });

      async.series(operations, (err, results) => {
        if (err) return error(err);
        console.log('\nCongralutions! Your extension is ready\n'.bold.green);
        prompt.stop();
      });

    });

  });
};

const createHTML = (file) => {
  return new Promise((resolve, reject) => {
    let nameFile = file.split('.');
    let ext = nameFile.pop();
    if(ext !== 'jade') {
      console.log(file + ' ignored');
      return resolve({ignored: true});
    }
    let html = pug.renderFile('./views/'+file, {pretty:true});
    resolve({html: html, file: nameFile.join('.') + '.html'});
  });
};

const writeHTML = (dir, html) => {
  return new Promise((resolve, reject) => {
    return fs.outputFile(dir, html, function(err) {
      if(err) return reject();
      return resolve();
    });
  });
};

const logInfo = (nav, string) => {
  var t = '['+nav+']';
  console.log(t.bold.blue, string);
};

const copyFileP = (src, target, nav, string) => {
  return new Promise((resolve, reject) => {
    return fs.copy(src, target, function (err) {
      if(err) return reject();
      logInfo(nav,string);
      return resolve();
    });
  });
};

const parseViews = () => {
  return new Promise((resolve, reject) => {
    fs.readdir('./views', function (err, files) {
      let render = [];
      files.forEach((val) => {
        render.push(createHTML(val));
      });
      return Promise.all(render).then((r) => {
        let html = [];
        r.forEach(val => {
          if(val.ignored) {
            return;
          }
          NAVIGATOR.forEach(nav => {
            html.push(writeHTML('./output/'+nav+'/views/'+ val.file, val.html));
            logInfo(nav,'views/'+val.file);
          });
        });
        return Promise.all(html).then(resolve);
      }).catch(reject);
    });
  });
};

const zipFolderP = (src, target) => {
  return new Promise((resolve, reject) => {
    zipFolder(src, target, function(err) {
      if(err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const zip = () => {
  return new Promise((resolve, reject) => {
    let pro = [];
    NAVIGATOR.forEach(val => {
      if(val === 'chrome') {
        pro.push(zipFolderP('./output/'+ val, './output/' + PACKAGE.name + '_' + PACKAGE.version + '_webstore' + '.zip'));
      }
      pro.push(zipFolderP('./output/'+ val, './output/' + PACKAGE.name + '_' + PACKAGE.version + '.' + NAV_OUT_ZIP[val]));
    });
    Promise.all(pro).then(() => {
      logInfo('All', 'Zip OK!');
      resolve();
    }).catch(console.error);
  });
};

const fileUpdateChrome = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(TPL_DIR + '/update/update_chrome.xml', function(err, data) {
      var json = parser.toJson(data, {object:true, coerce: true, reversible: true});
      json.gupdate.app.appid = 'une_appid_recup_du_fichier';
      json.gupdate.app.updatecheck.codebase = EXTENSION.update_url;
      json.gupdate.app.updatecheck.version = PACKAGE.version;
      var xml = '<?xml version="1.0" encoding="utf-8"?>';
      xml = xml + parser.toXml(json);
      xml = pd.pd.xml(xml);
      fs.writeFile('./output/update_chrome.xml', xml, (err) => {
        if (err) {
          return reject(err);
        }
        logInfo('chrome','Update xml create.');
        resolve();
      });
    });
  });
};

const fileUpdateFirefox = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(TPL_DIR + '/update/update_firefox.xml', function(err, data) {
      var json = parser.toJson(data, {object:true, coerce: true, reversible: true});
      json['RDF:RDF']['RDF:Description']['em:updates']['RDF:Seq']['RDF:li']['RDF:Description']['em:version'].$t = PACKAGE.version;
      json['RDF:RDF']['RDF:Description']['em:updates']['RDF:Seq']['RDF:li']['RDF:Description']['em:targetApplication']['RDF:Description']['em:id'].$t = '{une_appid_recup_du_fichier}';
      json['RDF:RDF']['RDF:Description']['em:updates']['RDF:Seq']['RDF:li']['RDF:Description']['em:targetApplication']['RDF:Description']['em:updateLink'].$t = EXTENSION.update_url;
      json['RDF:RDF']['RDF:Description']['em:version'].$t = PACKAGE.version;
      json['RDF:RDF']['RDF:Description']['em:updateLink'].$t = EXTENSION.update_url;
      var xml = '<?xml version="1.0" encoding="utf-8"?>';
      xml = xml + parser.toXml(json);
      xml = pd.pd.xml(xml);
      fs.writeFile('./output/update_firefox.xml', xml, (err) => {
        if (err) {
          return reject(err);
        }
        logInfo('firefox','Update xml create.');
        resolve();
      });
    });
  });
};

const pack = () => {

  fs.readJson('./package.json', function(err, data) {
    PACKAGE = data;
  });

  fs.readJson('./extension.json', function(err, data) {
    EXTENSION = data;
  });

  console.log('\nPacking...\n'.bold.yellow);
  console.log('           ((\\o/))\n'.cyan+
              '.-----------//^\\\\-----------.\n'.cyan+
              '|          /`| |`\\_______   |\n'.cyan+
              '|            | |  |BroxJS|  |\n'.cyan+
              '|            | |  """"""""  |\n'.cyan+
              '|            | |            |\n'.cyan+
              '\'------------===------------\'\n'.cyan);
  /*const configMapping = require(BROXJS_DIR + '/doc/manifest.mapping.json');
  const extInfos = require(currentDir + '/extension.json');
  console.log(broxjs.configUnifier('chrome', configMapping, extInfos));*/

  let pro = [];

  NAVIGATOR.forEach(val => {
    pro.push(copyFileP('./assets','./output/'+val+'/assets', val, 'Assets has been copied'));
    pro.push(copyFileP('./src','./output/'+val+'/src', val, 'Source has been copied'));
  });
  pro.push(parseViews());
  pro.push(fileUpdateChrome());
  pro.push(fileUpdateFirefox());

  Promise.all(pro).then(zip).then(() => {
    console.log('\nPacking completed\n'.bold.green);
  }).catch(console.error);
};

if (program.pack)
  fs.stat('./.broxrc', function (err, stat) {
    if(err) {
      return console.log('\nYou are not in project directory!\n'.bold.red);
    }
    pack();
  });
else
  init();
