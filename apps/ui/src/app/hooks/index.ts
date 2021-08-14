import axios from 'axios';
import { useQuery } from 'react-query';

import { splitGithubRepoPath } from '@file-browser/utils';

const API = {
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

export const useGithubFilePreview = ({
  user,
  repo,
  branch,
  filePath,
}: {
  user: string;
  repo: string;
  branch: string;
  filePath: string;
}) => {
  const query = useQuery(
    ['githubFilePreview', user, repo, branch, filePath],
    () => API.getGithubFilePreview(user, repo, branch, filePath),
    {
      enabled: !!user && !!repo && !!branch && !!filePath,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      retry: 1,
    }
  );

  return {
    ...query,
    objectURL: query.data && URL.createObjectURL(query.data),
  };
};

export const useGithubRepoTree = ({ repoPath }: { repoPath: string }) => {
  const [user, repo, branch] = splitGithubRepoPath(repoPath);
  const query = useQuery(
    ['githubRepoTree', user, repo, branch],
    () => API.getGithubTree(repoPath),
    {
      enabled: !!user && !!repo && !!branch,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
      retry: 0,
    }
  );

  return {
    ...query,
  };
};
