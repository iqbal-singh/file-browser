import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Directory } from '@file-browser/api-interfaces';

const FilePreviewModal = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #ddd;
  z-index: 1;
  width: 90%;
  max-width: 700px;
  max-height: 700px;
  height: 85%;
  margin: 5px auto;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 0px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h6`
  font-size: 16px;
  color: #000;
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

const FileContent = styled.embed`
  text-align: left;
  margin: 0px 20px;
  overflow: auto;
  height: 75%;
  width: 90%;
  max-height: 550px;
`;

type FilePreviewProps = {
  file?: Directory;
  fileName: string;
  onClose: () => void;
};

const filePreviewBaseURL = 'http://localhost:3333/api/file/preview?p=';

const FilePreview: React.FunctionComponent<FilePreviewProps> = ({
  fileName,
  onClose,
}) => {
  const [fileContent, setFileContent] = useState('');
  const { url } = useRouteMatch();

  useEffect(() => {
    if (!url) return;

    async function loadFile() {
      const response = await fetch(`${filePreviewBaseURL}${url}`);
      const blob = await response.blob();
      setFileContent(URL.createObjectURL(blob));
    }
    loadFile();
  }, []);

  return (
    <FilePreviewModal>
      <Title>
        {url}/{fileName}
      </Title>
      <CloseButton
        onClick={() => {
          onClose();
        }}
      >
        ✖
      </CloseButton>
      <br />

      {fileContent.length > 0 && <FileContent src={fileContent} />}
    </FilePreviewModal>
  );
};
export default FilePreview;
