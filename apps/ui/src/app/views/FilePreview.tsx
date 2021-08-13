import { splitGithubRepoPath } from '@file-browser/utils';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useGithubFilePreview } from '../hooks/';

const FilePreviewModal = styled.div`
  position: absolute;
  top: 1px;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #ddd;
  z-index: 1;
  width: 95%;
  max-width: 1000px;
  max-height: 1000px;
  height: 90%;
  margin: 5px auto;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 0px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 12px;
  color: #000;
  margin: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20px;
  cursor: pointer;
  outline: none;
  border: none;
  float: right;
  color: #000;
  background: transparent;
  padding: 0;
  margin: 5px 10px;
`;

const FileContent = styled.iframe`
  border: 1px solid #ddd;
  overflow: auto;
  height: 90%;
  width: 98%;
  max-height: 90vh;
`;

type FilePreviewProps = {
  root: string;
  filePath: string;
  fileTitle: string;
  onClose: () => void;
};

const FilePreview: React.FunctionComponent<FilePreviewProps> = ({
  filePath,
  fileTitle,
  onClose,
  root,
}) => {
  const [user, repo, branch] = splitGithubRepoPath(root);
  const { objectURL, error, isLoading } = useGithubFilePreview({
    user,
    repo,
    branch,
    filePath,
  });

  return (
    <FilePreviewModal>
      <Title>{error ? 'Error: file not found.' : fileTitle}</Title>
      <CloseButton
        onClick={() => {
          onClose();
        }}
      >
        ✖
      </CloseButton>
      {isLoading && 'Loading...'}
      {objectURL && <FileContent frameBorder={0} src={objectURL}></FileContent>}
    </FilePreviewModal>
  );
};
export default FilePreview;
