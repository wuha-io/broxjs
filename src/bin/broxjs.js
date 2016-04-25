#!/usr/bin/env node
'use strict';

import yesno from 'yesno';

yesno.ask('Are you sure you want to continue?', true, console.log.bind(console));
