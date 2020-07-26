/**
 * 下载项目模板
 */

const { existsSync } = require('fs');
// 命令管理
const commander = require('commander');
// 命令行交互工具
const inquirer = require('inquirer');
// 命令行中显示加载中
const ora = require('ora');
const GitHelper = require('./gitHelper');

class Download {
  constructor() {
    this.gitHelper = new GitHelper();
    this.commander = commander;
    this.inquirer = inquirer;
    this.getProList = ora('获取项目列表...');
    this.getTagList = ora('获取项目版本...');
    this.downLoad = ora('正在加速为您下载代码...');
  }

  run() {
    this.commander
      .command('download')
      .description('从远程下载代码到本地...')
      .action(() => { this.download(); });

    this.commander.parse(process.argv);
  }

  async download() {
    let getProListLoad;
    let getTagListLoad;
    let downLoadLoad;
    let repos;
    let version;

    // 获取所在项目组的所有可开发项目列表
    try {
      getProListLoad = this.getProList.start();
      let data = await this.gitHelper.getProjectList();
      repos = data.data;
      getProListLoad.succeed('获取项目列表成功');
    } catch (error) {
      console.log(error);
      getProListLoad.fail('获取项目列表失败...');
      process.exit(-1);
    }

    // 向用户咨询他想要开发的项目
    if (repos.length === 0) {
      console.log('\n可以开发的项目数为 0, 肯定是配置错啦~~\n'.red);
      process.exit(-1);
    }
    const choices = repos.map(({ name }) => name);
    const questions = [
      {
        type: 'list',
        name: 'repo',
        message: '请选择你想要开发的项目类型',
        choices,
      },
    ];
    const { repo } = await this.inquirer.prompt(questions);

    // 获取项目的版本, 这里默认选择确定项目的最近一个版本
    try {
      getTagListLoad = this.getTagList.start();
      const infos = await this.gitHelper.getProjectVersions(repo);
      if (infos.length === 0) {
        version = ''
      } else {
        [{ name: version }] = infos
      }
      getTagListLoad.succeed('获取项目版本成功');
    } catch (error) {
      console.log(error);
      getTagListLoad.fail('获取项目版本失败...');
      process.exit(-1);
    }

    // 向用户咨询欲创建项目的目录
    const repoName = [
      {
        type: 'input',
        name: 'repoPath',
        message: '请输入项目名称:',
        validate(v) {
          const done = this.async();
          if (!v.trim()) {
            done('项目名称不能为空~');
          }
          if (existsSync(`./${v}`)) {
            done('项目名称已存在~');
          }
          done(null, true);
        },
      },
    ];
    const { repoPath } = await this.inquirer.prompt(repoName);

    // 下载代码到指定的目录下
    try {
      downLoadLoad = this.downLoad.start();
      await this.gitHelper.downloadProject({ repo, version, repoPath });
      downLoadLoad.succeed('下载代码成功！');
      downLoadLoad.info(`You can execute command：cd ${repoPath}, and view README.md file.`);
    } catch (error) {
      console.log(error);
      downLoadLoad.fail('下载代码失败...');
    }
  }
}

module.exports = Download;
