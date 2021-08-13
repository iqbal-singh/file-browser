import { Directory } from '@file-browser/api-interfaces';
import {
  compareFunction,
  filterFunction,
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  truncateFileName,
} from '@file-browser/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumbs from '../components/Breadcrumbs';
import FilePreview from '../components/FilePreview';
import Search from '../components/Search';
import { useGithubRepoTree } from '../hooks';

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

const FileIcon = styled.div<{ type: string }>`
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
  const [githubRepo, setGithubRepo] = useState('');
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

  const {
    data: rootDirectory,
    error: rootDirectoryError,
    isLoading: isLoadingRootDirectory,
  } = useGithubRepoTree({ repoPath: githubRepo });

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
      const repo = urlParams.get('repo') as string;
      const sort = urlParams.get('sort') as keyof Directory;
      const sortOrder = urlParams.get('order') as 'asc' | 'desc';
      const search = urlParams.get('search') as string;
      setCurrentSort(sort);
      setCurrentSortOrder(sortOrder);
      setCurrentSearch(search);
      setGithubRepo(repo);
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
      search: `?repo=${githubRepo}&sort=${sortKey}&order=${
        toggleSortOrder || currentSortOrder
      }&search=${currentSearch}`,
    });
  };

  const handleRowClick = (item: Directory) => () => {
    if (item.type === 'dir') {
      history.push({
        pathname: `${url}/${item.name}`,
        search: `?repo=${githubRepo}&sort=${currentSort}&order=${currentSortOrder}&search=${''}`,
      });
    } else {
      history.push({
        search: `?repo=${githubRepo}&sort=${currentSort}&order=${currentSortOrder}&search=${currentSearch}`,
        hash: `preview=${item.path}`,
      });
    }
  };

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const searchTerm = event.target.value.trim();
    history.push({
      search: `?repo=${githubRepo}&sort=${currentSort}&order=${currentSortOrder}&search=${searchTerm}`,
      hash: '',
    });
  };

  const handleClosePreview = () => {
    history.push({
      search: `?repo=${githubRepo}&sort=${currentSort}&order=${currentSortOrder}&search=${currentSearch}`,
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

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const val = githubRepo;
    const [user, repo, branch] = val.split('/');
    if (user && repo && branch) {
      history.push({
        search: `?repo=${val}&sort=${currentSort}&order=${currentSortOrder}&search=${currentSearch}`,
        hash: '',
      });
    }
  };

  const handleGithubRepoChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setGithubRepo(event.target.value);
  };

  return (
    <>
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '4px' }}>
        <form onSubmit={handleFormSubmit}>
          <Search
            value={githubRepo}
            placeHolder="Enter a GitHub [USER]/[REPO]/[BRANCH] like 'facebook/react/main' "
            onChange={handleGithubRepoChange}
          />
        </form>

        {rootDirectoryError && (
          <div>
            <h4>Error</h4>
            <pre>{JSON.stringify(rootDirectoryError, null, 2)}</pre>
          </div>
        )}
      </div>

      {isLoadingRootDirectory && (
        <div>
          <h4>Loading Files</h4>
          <pre> </pre>
        </div>
      )}
      {rootDirectory ? (
        <>
          <Breadcrumbs githubRepo={githubRepo} url={url} seperator=">" />
          <Search
            placeHolder={`Search ${url}`}
            value={currentSearch}
            onChange={handleSearch}
          />
          <Table>
            <thead onClick={handleHeaderClick}>
              <TableRow>
                <TableHeader id="type"></TableHeader>
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
                <TableRow onClick={handleRowClick(item)} key={`${item.url}`}>
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
        </>
      ) : null}
      {/* File Preview Modal */}
      {location.hash && (
        <FilePreview
          root={githubRepo}
          filePath={preview ?? ''}
          fileTitle={preview?.split('/')?.pop() ?? ''}
          onClose={handleClosePreview}
        />
      )}
    </>
  );
};

export default FileBrowser;
