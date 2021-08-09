import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Directory } from '@file-browser/api-interfaces';
import {
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  truncateFileName,
} from '@file-browser/utils';

import Breadcrumbs from '../components/Breadcrumbs';
import FilePreview from '../components/FilePreview';

const Table = styled.table`
  min-width: 300px;
  max-width: 1600px;
  width: 80%;
  margin: 16px auto;
  box-shadow: 0 0px 8px rgba(0, 0, 0, 0.2);
  border-spacing: 0;
  background-color: rgb(0,0,0,0.1))
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  text-align: left;
  border-bottom: 1px solid #ddd;
  padding: 16px 8px;
`;

const TableRow = styled.tr`
  cursor: pointer;
  height: 30px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: rgb(115, 206, 255);
  }
`;

const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 8px;

  &:nth-child(2):hover {
    text-decoration: underline;
    text-decoration-color: black;
  }
`;

const FileIcon = styled.div<{ type: 'dir' | 'file' }>`
  &::before {
    content: ${(props) => (props.type === 'dir' ? "'📁'" : "'📄'")};
  }
`;

const FileBrowser: React.FunctionComponent = () => {
  const [rootDirectory, setRootDirectory] = useState<Directory>();
  const [selectedDirectory, setSelectedDirectory] = useState<Directory>();
  const [preview, setPreview] = useState('');
  const { url } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const [currentSort, setCurrentSort] = useState<keyof Directory>('type');

  useEffect(() => {
    async function fetchRootDirectory() {
      const res = await fetch(`http://localhost:3333/api/files`);
      const json = await res.json();
      setRootDirectory(json);
      return json;
    }

    fetchRootDirectory();
  }, []);

  useEffect(() => {
    if (!rootDirectory) return;

    const filePath = url.split('/');
    filePath.shift();

    const currentDirectory = findSubDirectory(rootDirectory, filePath);

    if (currentDirectory) {
      setSelectedDirectory(currentDirectory);
    } else {
      if (location.hash === '') {
        history.push(`/${rootDirectory.name}`);
      }
      setSelectedDirectory(rootDirectory);
    }

    if (location.hash) {
      const previewURL = location.hash.split('=')[1];
      setPreview(previewURL);
    } else {
      setPreview('');
    }

    if (location.search) {
      const sort = location.search.split('=')[1] as keyof Directory;
      setCurrentSort(sort);
    }
  }, [
    rootDirectory,
    history,
    url,
    selectedDirectory,
    location.hash,
    location.search,
  ]);

  const handleRowClick = (item: Directory) => () => {
    if (item.type === 'dir') {
      history.push(`${url}/${item.name}`);
    } else {
      history.push(`?sort=${currentSort}#preview=${item.name}`);
    }
  };

  const handleHeaderClick: React.MouseEventHandler<HTMLTableSectionElement> = (
    event
  ) => {
    const header = event.target as HTMLElement;
    const sortKey = header.id as keyof Directory;
    history.push(`?sort=${sortKey}`);
    //setCurrentSort(sortKey);
  };

  const compareFunction = (sortKey: keyof Directory) => {
    const map = new Map<string, (a: Directory, b: Directory) => number>([
      ['name', (a: Directory, b: Directory) => a.name.localeCompare(b.name)],
      ['sizeKb', (a: Directory, b: Directory) => a.sizeKb - b.sizeKb],
      ['type', (a: Directory, b: Directory) => a.type.localeCompare(b.type)],
      [
        'fileType',
        (a: Directory, b: Directory) =>
          getFileExtension(a.name).localeCompare(getFileExtension(b.name)),
      ],
    ]);
    return map.get(sortKey);
  };

  return (
    <>
      <Breadcrumbs url={url} />
      <Table>
        <thead onClick={handleHeaderClick}>
          <TableRow>
            <TableHeader id="type"></TableHeader>
            <TableHeader id="name">Name</TableHeader>
            <TableHeader id="sizeKb">Size</TableHeader>
            <TableHeader id="fileType">Type</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {selectedDirectory?.items?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>No files to display.</TableCell>
            </TableRow>
          )}
          {selectedDirectory?.items
            ?.sort(compareFunction(currentSort))
            ?.map((item, index) => (
              <TableRow
                onClick={handleRowClick(item)}
                key={`${item.name}-${index}`}
              >
                <TableCell width={10}>
                  <FileIcon type={item.type} />
                </TableCell>
                <TableCell>{truncateFileName(item.name, 100)}</TableCell>
                <TableCell>{formatKbFileSize(item.sizeKb)}</TableCell>
                <TableCell>{getFileExtension(item.name)}</TableCell>
              </TableRow>
            ))}
        </tbody>
      </Table>
      {/* File Preview Modal */}
      {location.hash && (
        <FilePreview
          fileName={preview}
          onClose={() => {
            history.push(`?sort=${currentSort}#`);
          }}
        />
      )}
    </>
  );
};

export default FileBrowser;
