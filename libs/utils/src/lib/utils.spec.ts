import { Directory } from '@file-browser/api-interfaces';
import {
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  truncateFileName,
} from './utils';

const mockDirectory: Directory = {
  name: 'test',
  sizeKb: 120,
  type: 'dir',
  items: [
    {
      name: 'test.txt',
      sizeKb: 10,
      type: 'file',
    },
    {
      name: 'videos',
      sizeKb: 0,
      type: 'dir',
      items: [],
    },
  ],
};

describe('findSubDirectory', () => {
  it('should return the root directory', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test']);
    expect(subDirectory).toEqual(mockDirectory);
  });
  it('should return the correct subdirectory', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test', 'videos']);
    expect(subDirectory).toEqual(mockDirectory.items[1]);
  });
  it('should return undefined for an invalid path', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test', 'aaaaa']);
    expect(subDirectory).toEqual(undefined);
  });
});

describe('formatKbFileSize', () => {
  it('should format the file size', () => {
    expect(formatKbFileSize(mockDirectory.sizeKb)).toEqual('120 KB');
    expect(formatKbFileSize(0)).toEqual('-');
  });
});

describe('getFileExtension', () => {
  it('should return the extension', () => {
    expect(getFileExtension('test.txt')).toEqual('txt');
    expect(getFileExtension('test.mp3')).toEqual('mp3');
    expect(getFileExtension('test.....mp3')).toEqual('mp3');
    expect(getFileExtension('folder')).toEqual('-');
  });
});

describe('truncateFileName', () => {
  it('should truncate the file name', () => {
    expect(truncateFileName('test111111111111111.txt', 3)).toEqual(
      'tes[...].txt'
    );
    expect(truncateFileName('test.txt', 2)).toEqual('te[...].txt');
  });
});
