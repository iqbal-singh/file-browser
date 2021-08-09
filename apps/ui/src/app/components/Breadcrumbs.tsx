import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LinkWrapper = styled.div`
  font-size: 16px;
  width: 80%;
  margin: 16px auto;
`;

type BreadcrumbsProps = {
  url: string;
};

const createLinks = (url: string): { title: string; url: string }[] => {
  const folders = url.substring(1).split('/');
  return folders.map((folder, index) => {
    return {
      title: folder,
      url: `/${folders.slice(0, index + 1).join('/')}`,
    };
  });
};

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ url }) => {
  const [links, setLinks] = useState(() => createLinks(url));

  useEffect(() => {
    setLinks(createLinks(url));
  }, [url]);

  return (
    <LinkWrapper>
      {links?.map(({ title, url }, index) => {
        return (
          <span key={title}>
            <Link to={url}>{title}</Link>
            {`${index !== links.length - 1 ? ' / ' : ''}`}
          </span>
        );
      })}
    </LinkWrapper>
  );
};

export default Breadcrumbs;
