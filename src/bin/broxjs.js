#!/usr/bin/env node
'use strict';

import Promise from 'bluebird';
import async from 'async';
import gitconfig from 'git-config';
import prompt from 'prompt';
import colors from 'colors/safe';

const fs = Promise.promisifyAll(require('fs-extra'));

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

  prompt.message = colors.red('Broxjs');
  prompt.start();

  prompt.get(schema, (err, result) => {

    if (err) return error(err);

    const extInfos = require(TPL_DIR + '/extension.json');
    extInfos.name = extInfos.browser_action.default_title = result.name;
    extInfos.version = result.version;
    extInfos.author = result.author;
    extInfos.description = result.description;
    extInfos.extension_url = result.homepageURL;
    extInfos.update_url = result.homepageURL + '/update';
    //console.log(JSON.stringify(extInfos, null, 2));

    fs.writeJson(CUR_DIR + '/extension.json', extInfos, {spaces: 2});

  });

});
