import { useQuery } from 'react-query';

import API from '../api';

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
  const [user, repo, branch] = repoPath.split('/');
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
