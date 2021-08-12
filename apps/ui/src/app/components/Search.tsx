import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-width: 300px;
  max-width: 1600px;
  margin: 12px auto;
  width: 80%;
  border-spacing: 0;
`;

const Input = styled.input`
  width: 99%;
  max-width: 1600px;
  padding: 8px 6px;
  font-family: inherit;
  outline: none;
  border: 1px solid #ccc;
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.2);
`;

type SearchProps = {
  value: string;
  placeHolder?: string;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Search: React.FunctionComponent<SearchProps> = ({
  placeHolder = '',
  required = false,
  value,
  onChange,
}) => {
  return (
    <Container>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        required={required}
      />
    </Container>
  );
};

export default Search;
