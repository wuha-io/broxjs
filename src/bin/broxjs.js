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

import broxjs from '../index';

const BROXJS_DIR = '/usr/local/lib/node_modules/broxjs';
const TPL_DIR = BROXJS_DIR + '/template';

const pkg = require(__dirname + '/../../package.json');

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

      [ 'babelrc', 'bowerrc', 'editorconfig', 'gitattributes', 'gitignore', 'jshintrc' ]
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

const pack = () => {
  console.log('\nPacking...'.bold.yellow);

  const configMapping = require(BROXJS_DIR + '/doc/manifest.mapping.json');
  const extInfos = require(currentDir + '/extension.json');
  console.log(broxjs.configUnifier('chrome', configMapping, extInfos));
};

if (program.pack)
  pack();
else
  init();
