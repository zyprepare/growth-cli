const commander = require('commander');
const Download = require('../tools/download')

const D = new Download();

commander
  .command('init')
  .description('从远程下载代码到本地...')
  .action(() => { D.download(); });

commander.parse(process.argv);
