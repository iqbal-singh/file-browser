import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LinksWrapper = styled.div`
  font-size: 20px;
  min-width: 300px;
  max-width: 1600px;
  width: 80%;
  margin: 16px auto;
`;

type BreadcrumbsProps = {
  githubRepo: string;
  url: string;
  seperator: string;
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

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  githubRepo,
  url,
  seperator = '/',
}) => {
  const links = useMemo(() => createLinks(url), [url]);
  return (
    <LinksWrapper>
      <b>{`${githubRepo.split('/').join(` ${seperator} `)} ${seperator} `}</b>
      {links?.map(({ title, url }, index) => {
        return (
          <span key={title}>
            <Link to={url}>{title}</Link>
            {`${index < links.length - 1 ? ` ${seperator} ` : ''}`}
          </span>
        );
      })}
    </LinksWrapper>
  );
};

export default Breadcrumbs;
