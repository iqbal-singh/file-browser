import { Directory } from '@file-browser/api-interfaces';

export const isValidGithubRepoPath = (path: string): boolean => {
  const [user, repo, branch] = path.split('/');
  if (user && repo && branch) {
    return true;
  }
  return false;
};

export const splitGithubRepoPath = (path: string): string[] => {
  const [user, repo, branch] = path.split('/');
  return [user, repo, branch];
};

export const findSubDirectory = (directory: Directory, filePath: string[]) => {
  let currentDirectory: Directory | undefined;
  if (filePath.length === 1 && filePath[0] === directory.name) {
    return directory;
  }

  let count = 1;
  for (const part of filePath) {
    for (const item of directory.items ?? []) {
      if (item.name === part && item.type === 'dir') {
        currentDirectory = item;
        count++;
      }
    }
  }

  if (currentDirectory && count !== filePath.length) {
    for (const part of filePath.slice(count)) {
      for (const item of currentDirectory?.items ?? []) {
        if (item.name === part && item.type === 'dir') {
          currentDirectory = item;
        }
      }
    }
  }

  return currentDirectory;
};

export const formatKbFileSize = (sizeKb: number): string => {
  if (sizeKb === 0) {
    return '-';
  }
  if (sizeKb < 1000) {
    return `${sizeKb.toFixed(2)} KB`;
  }
  const sizeMb = sizeKb / 1000;

  const sizeGb = sizeMb / 1000;
  return sizeGb > 1 ? `${sizeGb.toFixed(2)} GB` : `${sizeMb.toFixed(2)} MB`;
};

export const truncateFileName = (fileName: string, length: number): string => {
  if (fileName === '') {
    return '';
  }
  const ext = getFileExtension(fileName);
  if (ext === '-' && fileName.length >= length) {
    return fileName.substr(0, length) + '[...]';
  }

  if (fileName.length >= length) {
    return fileName.substr(0, length) + '[...].' + ext;
  }

  return fileName;
};

export const getFileExtension = (fileName: string): string => {
  if (fileName === '') {
    return '-';
  }
  const ext = fileName?.split('.');
  if (ext.length <= 1) {
    return '-';
  }
  return ext?.pop() ?? '-';
};

export const compareFunction = (
  sortKey: keyof Directory | 'fileType',
  sortOrder: 'asc' | 'desc'
) => {
  const order = sortOrder === 'asc' ? 1 : -1;
  const map = new Map<string, (a: Directory, b: Directory) => number>([
    [
      'name',
      (a: Directory, b: Directory) => order * a.name.localeCompare(b.name),
    ],
    [
      'sizeKb',
      (a: Directory, b: Directory) =>
        order === 1 ? a.sizeKb - b.sizeKb : b.sizeKb - a.sizeKb,
    ],
    [
      'type',
      (a: Directory, b: Directory) => order * a.type.localeCompare(b.type),
    ],
    [
      'fileType',
      (a: Directory, b: Directory) =>
        order *
        getFileExtension(a.name).localeCompare(getFileExtension(b.name)),
    ],
  ]);
  return map.get(sortKey);
};

export const filterFunction = (searchTerm: string) => {
  return (item: Directory) => {
    const searchTermLower = searchTerm?.toLowerCase().trim();
    if (!searchTermLower) {
      return true;
    }

    const name = item?.name?.toLowerCase();
    return name.includes(searchTermLower);
  };
};
