const download = require('download-git-repo');
const request = require('./request');
const { orgName } = require('../../config');
const axios = require('axios');

class GitHelper {
  constructor() {
    this.orgName = orgName
  }

  /**
   * 获取项目模板列表
   */
  getProjectList() {
    return axios.get(`https://api.github.com/orgs/growth-org/repos`)
  }

  /**
   * 获取项目模板版本列表
   * @param {String} repo
   */
  getProjectVersions(repo) {
    return request(`/repos/${this.orgName}/${repo}/tags`)
  }

  /**
   * 下载 github 项目
   * @param {Object} param 项目信息 项目名称 项目版本 本地开发目录
   */
  downloadProject({ repo, version = '', repoPath }) {
    let versionStr = version.length > 0 ? `#${version}` : version
    // console.log(`---url: ${this.orgName}/${repo}${versionStr}`)
    return new Promise((resolve, reject) => {
      download(`${this.orgName}/${repo}${versionStr}`, repoPath, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = GitHelper;
