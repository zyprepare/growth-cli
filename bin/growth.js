#!/usr/bin/env node
const commander = require('commander');
const { existsSync } = require('fs');
const { resolve } = require('path');
const { version } = require('../package.json');

require('colors');

commander.version(version)
  .parse(process.argv);

const [todo = ''] = commander.args;

if (existsSync(resolve(__dirname, `../src/command/${todo}.js`))) {
  require(`../src/command/${todo}.js`);
} else {
  console.log(
    `
      你输入了未知指令...
    `.red,
  );
  process.exit(-1);
}
