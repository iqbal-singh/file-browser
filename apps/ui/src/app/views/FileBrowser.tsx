import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Directory } from '@file-browser/api-interfaces';
import {
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  truncateFileName,
  filterFunction,
  compareFunction,
} from '@file-browser/utils';

import Breadcrumbs from '../components/Breadcrumbs';
import FilePreview from '../components/FilePreview';
import Search from '../components/Search';

const Table = styled.table`
  min-width: 300px;
  max-width: 1600px;
  width: 80%;
  margin: 16px auto;
  box-shadow: 0 0px 6px rgba(0, 0, 0, 0.2);
  border-spacing: 0;
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

const SortIcon = styled.span<{
  sortKey: keyof Directory | 'fileType';
  currentSort: keyof Directory | 'fileType';
  currentSortOrder: 'asc' | 'desc';
}>`
  &::after {
    content: ${(props) =>
      props.currentSort === props.sortKey
        ? `'${props.currentSortOrder === 'asc' ? ' 🔼' : ' 🔽'}'`
        : ''};
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
  const [currentSortOrder, setCurrentSortOrder] = useState<'asc' | 'desc'>(
    'asc'
  );
  const [currentSearch, setCurrentSearch] = useState('');

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
  }, [rootDirectory, history, url, selectedDirectory, location.hash]);

  useEffect(() => {
    if (location.hash) {
      const previewURL = location.hash.split('=')[1];
      setPreview(previewURL);
    } else {
      setPreview('');
    }
  }, [location.hash]);

  useEffect(() => {
    if (location.search) {
      const urlParams = new URLSearchParams(location.search);
      const sort = urlParams.get('sort') as keyof Directory;
      const sortOrder = urlParams.get('order') as 'asc' | 'desc';
      const search = urlParams.get('search') as string;
      setCurrentSort(sort);
      setCurrentSortOrder(sortOrder);
      setCurrentSearch(search);
    }
  }, [location.search]);

  const handleHeaderClick: React.MouseEventHandler<HTMLTableSectionElement> = (
    event
  ) => {
    const header = event.target as HTMLElement;
    const sortKey = header?.closest('th')?.id as keyof Directory | 'fileType';
    if (!sortKey) return;
    let toggleSortOrder = null;
    if (sortKey === currentSort) {
      toggleSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    }

    history.push({
      search: `?sort=${sortKey}&order=${
        toggleSortOrder || currentSortOrder
      }&search=${currentSearch}`,
    });
  };

  const handleRowClick = (item: Directory) => () => {
    if (item.type === 'dir') {
      history.push({
        pathname: `${url}/${item.name}`,
        search: `?sort=${currentSort}&order=${currentSortOrder}&search=${''}`,
      });
    } else {
      history.push({
        search: `?sort=${currentSort}&order=${currentSortOrder}&search=${currentSearch}`,
        hash: `preview=${item.name}`,
      });
    }
  };

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const searchTerm = event.target.value.trim();
    history.push({
      search: `?sort=${currentSort}&order=${currentSortOrder}&search=${searchTerm}`,
      hash: '',
    });
  };

  const handleClosePreview = () => {
    history.push({
      search: `?sort=${currentSort}&order=${currentSortOrder}&search=${currentSearch}`,
      hash: '',
    });
  };

  const items = useMemo(
    () =>
      selectedDirectory?.items
        ?.filter(filterFunction(currentSearch))
        ?.sort(compareFunction(currentSort, currentSortOrder)),
    [currentSearch, currentSort, currentSortOrder, selectedDirectory]
  );

  return (
    <>
      <Breadcrumbs url={url} seperator=">" />
      <Search value={currentSearch} onChange={handleSearch} />
      <Table>
        <thead onClick={handleHeaderClick}>
          <TableRow>
            <TableHeader id="type">
              <SortIcon
                sortKey="type"
                currentSort={currentSort}
                currentSortOrder={currentSortOrder}
              />
            </TableHeader>
            <TableHeader id="name">
              Name
              <SortIcon
                sortKey="name"
                currentSort={currentSort}
                currentSortOrder={currentSortOrder}
              />
            </TableHeader>
            <TableHeader id="sizeKb">
              Size
              <SortIcon
                sortKey="sizeKb"
                currentSort={currentSort}
                currentSortOrder={currentSortOrder}
              />
            </TableHeader>
            <TableHeader id="fileType">
              Type
              <SortIcon
                sortKey="fileType"
                currentSort={currentSort}
                currentSortOrder={currentSortOrder}
              />
            </TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {items?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                {currentSearch === ''
                  ? `No files to display.`
                  : `No files matching '${currentSearch}'.`}
              </TableCell>
            </TableRow>
          )}
          {items?.map((item, index) => (
            <TableRow
              onClick={handleRowClick(item)}
              key={`${item.name}-${item.sizeKb}-${index}`}
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
        <FilePreview fileName={preview} onClose={handleClosePreview} />
      )}
    </>
  );
};

export default FileBrowser;
