import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-width: 300px;
  max-width: 1600px;
  margin: 12px auto;
  width: 80%;
`;

const Input = styled.input`
  width: 99%;
  max-width: 1600px;
  padding: 8px 6px;
  font-family: inherit;
  border: 1px solid #ccc;
`;

type SearchProps = {
  value: string;
  placeHolder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Search: React.FunctionComponent<SearchProps> = ({
  placeHolder = '',
  required = false,
  disabled = false,
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
        disabled={disabled}
      />
    </Container>
  );
};

export default Search;
