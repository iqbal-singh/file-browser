import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const FilePreviewModal = styled.div`
  position: absolute;
  top: 1px;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #ddd;
  z-index: 1;
  width: 90%;
  max-width: 1200px;
  max-height: 800px;
  height: 95%;
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
  height: 85%;
  width: 98%;
  max-height: 600px;
`;

type FilePreviewProps = {
  root: string;
  filePath: string;
  fileTitle: string;
  onClose: () => void;
};

const filePreviewBaseURL = '';

const FilePreview: React.FunctionComponent<FilePreviewProps> = ({
  filePath,
  fileTitle,
  onClose,
  root,
}) => {
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!filePath) return;

    async function loadFile() {
      setFileContent('');
      setError(false);
      try {
        const [user, repo, branch] = root.split('/');
        const response = await fetch(
          `https://raw.githubusercontent.com/${user}/${repo}/${branch}${filePath}`
        );
        if (response.status === 200) {
          const data = await response.blob();
          console.log(data.type);
          setFileContent(URL.createObjectURL(data));
        } else {
          throw new Error(`Failed to load file: ${filePath}`);
        }
      } catch (e) {
        setError(true);
      }
    }

    loadFile();
    window.scrollTo(0, 0);
  }, [root, filePath]);

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
      {fileContent.length > 0 && (
        <FileContent frameBorder={0} src={fileContent}></FileContent>
      )}
    </FilePreviewModal>
  );
};
export default FilePreview;
