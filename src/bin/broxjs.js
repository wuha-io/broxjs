#!/usr/bin/env node
'use strict';

import fs from 'fs-extra';
import async from 'async';
import gitconfig from 'git-config';
import prompt from 'prompt';
import colors from 'colors';
import cproc from 'child_process';

const CUR_DIR = process.cwd();
const TPL_DIR = '/usr/local/lib/node_modules/broxjs/template';

const error = err => {
  console.error(err);
  process.exit(1);
};

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
    writeJsonOperation(CUR_DIR + '/extension.json', extInfos);

    const npm = require(TPL_DIR + '/package.json');
    npm.name = result.shortName;
    npm.version = result.version;
    npm.description = result.description;
    if (result.repository) npm.repository = result.repository;
    writeJsonOperation(CUR_DIR + '/package.json', npm);

    const bower = require(TPL_DIR + '/bower.json');
    bower.name = result.shortName;
    bower.authors.push(result.author);
    writeJsonOperation(CUR_DIR + '/bower.json', bower);

    [ 'babelrc', 'bowerrc', 'editorconfig', 'gitattributes', 'gitignore', 'jshintrc' ]
      .forEach(file => copyOperation(TPL_DIR + '/' + file, CUR_DIR + '/.' + file));

    [ 'assets/', 'src/', 'test/', 'views/' ]
      .concat([ 'LICENSE', 'README.md' ])
      .concat([ 'gulpfile.babel.js' ])
        .forEach(file => copyOperation(TPL_DIR + '/' + file, CUR_DIR + '/' + file));

    operations.push(cbk => {
      console.log('\nInstalling dependencies...'.bold.red);
      cproc.exec('npm i && bower i', cbk);
    });

    async.parallel(operations, (err, results) => {

      if (err) return error(err);

      console.log('\nCongralutions! Your extension is ready, please...'.bold.green);

    });

  });

});
