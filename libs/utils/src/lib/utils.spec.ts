import faker = require('faker');

import { Directory } from '@file-browser/api-interfaces';
import {
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  truncateFileName,
} from './utils';

const createFiles = (n: number) => {
  const files: Directory[] = [];
  for (let i = 0; i < n; i++) {
    files.push({
      name: faker.system.commonFileName(),
      sizeKb: faker.datatype.number(),
      type: 'file',
    });
  }
  return files;
};

const createDirs = (n: number) => {
  const dirs: Directory[] = [];
  for (let i = 0; i < n; i++) {
    dirs.push({
      name: faker.commerce.color(),
      sizeKb: 0,
      type: 'dir',
      items: createFiles(faker.datatype.number(20)),
    });
  }
  return dirs;
};

const mockDirectory: Directory = {
  name: 'home',
  sizeKb: 0,
  type: 'dir',
  items: [
    {
      name: 'lib',
      sizeKb: 0,
      type: 'dir',
      items: [
        {
          name: 'main.go',
          sizeKb: 320,
          type: 'file',
        },
        {
          name: 'app',
          sizeKb: 0,
          type: 'dir',
          items: [
            {
              name: 'src',
              sizeKb: 10,
              type: 'dir',
              items: [
                {
                  name: 'test2.css',
                  sizeKb: 1033,
                  type: 'file',
                },
                {
                  name: 'test33.js',
                  sizeKb: 130,
                  type: 'file',
                },
                {
                  name: 'test333.html',
                  sizeKb: 130,
                  type: 'file',
                },
                {
                  name: 'test4433.js',
                  sizeKb: 1220,
                  type: 'file',
                },
                {
                  name: 'f3',
                  sizeKb: 0,
                  type: 'dir',
                  items: [],
                },
              ],
            },
          ],
        },

        {
          name: 'telw.json',
          sizeKb: 1011111111,
          type: 'file',
        },
        {
          name: 'test.go',
          sizeKb: 3320,
          type: 'file',
        },
      ],
    },

    {
      name: 'README.md',
      sizeKb: 4340,
      type: 'file',
    },
    {
      name: 'App.js',
      sizeKb: 320,
      type: 'file',
    },
  ],
};

describe('findSubDirectory', () => {
  it('should return the root directory', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['home']);
    expect(subDirectory).toEqual(mockDirectory);
  });
  it('should return the correct subdirectory', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['home', 'lib']);
    expect(subDirectory).toEqual(mockDirectory.items[0]);
  });
  it('should return the correct subdirectory deep', () => {
    const subDirectory = findSubDirectory(mockDirectory, [
      'home',
      'lib',
      'app',
      'src',
      'f3',
    ]);
    expect(subDirectory).toEqual(
      mockDirectory.items[0].items[1].items[0].items[4]
    );
  });
  it('should return undefined for an invalid path', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test', 'aaaaa']);
    expect(subDirectory).toEqual(undefined);
  });
});

describe('formatKbFileSize', () => {
  it('should format the file size', () => {
    expect(formatKbFileSize(52.33)).toEqual('52.33 KB');
    expect(formatKbFileSize(120)).toEqual('120.00 KB');
    expect(formatKbFileSize(0)).toEqual('-');
  });
});

describe('getFileExtension', () => {
  it('should return the extension', () => {
    expect(getFileExtension('test.txt')).toEqual('txt');
    expect(getFileExtension('test.mp3')).toEqual('mp3');
    expect(getFileExtension('test.....mp3')).toEqual('mp3');
    expect(getFileExtension('folder')).toEqual('-');
    expect(getFileExtension('')).toEqual('-');
  });
});

describe('truncateFileName', () => {
  it('should truncate the file name', () => {
    expect(truncateFileName('test111111111111111.txt', 3)).toEqual(
      'tes[...].txt'
    );
    expect(truncateFileName('test.txt', 2)).toEqual('te[...].txt');
    expect(truncateFileName('folder', 4)).toEqual('fold[...]');
    expect(truncateFileName('', 4)).toEqual('');
  });
});
