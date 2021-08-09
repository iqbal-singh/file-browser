import { Directory } from '@file-browser/api-interfaces';

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
    return `${sizeKb} KB`;
  }
  const sizeMb = sizeKb / 1000;

  const sizeGb = sizeMb / 1000;
  return sizeGb > 1 ? `${sizeGb.toFixed(2)} GB` : `${sizeMb.toFixed(2)} MB`;
};

export const truncateFileName = (fileName: string, length: number): string => {
  // eslint-disable-next-line prefer-const
  let [name, extension] = fileName.split('.');
  if (name.length > length) {
    name = name.substring(0, length) + '[...]';
  }
  if (!extension) {
    return name;
  }
  return `${name}.${extension}`;
};

export const getFileExtension = (fileName: string): string => {
  const ext = fileName?.split('.');
  if (ext.length <= 1) {
    return '-';
  }
  return ext?.pop() ?? '-';
};
