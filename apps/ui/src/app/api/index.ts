import axios from 'axios';

export default {
  getGithubTree: (repoPath: string) => {
    return axios
      .get(`/api/files?userRepoBranch=${repoPath}`, {
        timeout: 600000,
      })
      .then((res) => res.data);
  },
  getGithubFilePreview: (
    user: string,
    repo: string,
    branch: string,
    filePath: string
  ) => {
    return axios
      .get(
        `https://raw.githubusercontent.com/${user}/${repo}/${branch}${filePath}`,
        {
          responseType: 'blob',
          timeout: 600000,
        }
      )
      .then((res) => res.data);
  },
};
