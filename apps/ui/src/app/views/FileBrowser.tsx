import { Directory } from '@file-browser/api-interfaces';
import {
  compareFunction,
  filterFunction,
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  isValidGithubRepoPath,
  truncateFileName,
} from '@file-browser/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { FileIcon, SortIcon } from '../components/Icon';
import { Input, InputContainer } from '../components/Input';
import { Table, TableCell, TableHeader, TableRow } from '../components/Table';
import { useGithubRepoTree } from '../hooks';
import FilePreview from './FilePreview';

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
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  const handleGithubRepoChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const val = event.target.value;
    setGithubRepo(val);
  };

  const handleGithubRepoBlur: React.FocusEventHandler<HTMLInputElement> =
    () => {
      if (isValidGithubRepoPath(githubRepo)) {
        history.push({
          search: `?repo=${githubRepo}&sort=${currentSort}&order=${currentSortOrder}&search=${currentSearch}`,
          hash: '',
        });
        searchInputRef?.current?.focus();
      }
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
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '4px' }}>
        <InputContainer>
          <Input
            value={githubRepo}
            placeholder="Enter a GitHub [USER]/[REPO]/[BRANCH] like 'facebook/react/main' "
            onChange={handleGithubRepoChange}
            onBlur={handleGithubRepoBlur}
          />
        </InputContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
        {rootDirectoryError && (
          <div>
            <h4>Error</h4>
            <pre>{JSON.stringify(rootDirectoryError, null, 2)}</pre>
          </div>
        )}

        {isLoadingRootDirectory && (
          <div>
            <h4>Loading Files...</h4>
            <pre> </pre>
          </div>
        )}
      </div>
      {rootDirectory ? (
        <>
          <Breadcrumbs githubRepo={githubRepo} url={url} seperator=">" />
          <InputContainer>
            <Input
              placeholder={`Search ${url}`}
              value={currentSearch}
              onChange={handleSearch}
              ref={searchInputRef}
            />
          </InputContainer>
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
                  key={`${item.name}-${item.path}-${item.url}`}
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
