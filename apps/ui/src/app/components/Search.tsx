import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

const Input = styled.input`
  padding: 10px 0px;

  border: 1px solid #ccc;
  outline: none;
  width: 100%;
`;

type SearchProps = {};

const Search: React.FunctionComponent<SearchProps> = () => {
  return <Input placeholder="Search..." />;
};

export default Search;
