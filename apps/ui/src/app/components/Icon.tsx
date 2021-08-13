import styled from 'styled-components';

import { Directory } from '@file-browser/api-interfaces';

export const FileIcon = styled.div<{ type: string }>`
  &::before {
    content: ${(props) => (props.type === 'dir' ? "'📁'" : "'📄'")};
  }
`;

export const SortIcon = styled.span<{
  sortKey: keyof Directory | 'fileType';
  currentSort: keyof Directory | 'fileType';
  currentSortOrder: 'asc' | 'desc';
}>`
  &::after {
    content: ${(props) =>
      props.currentSort === props.sortKey
        ? `'${props.currentSortOrder === 'asc' ? ' \u2191' : '  \u2193'}'`
        : ''};
  }
`;
