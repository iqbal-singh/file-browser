import styled from 'styled-components';

export const Table = styled.table`
  min-width: 300px;
  max-width: 1600px;
  width: 80%;
  margin: 16px auto;
  box-shadow: 0 0px 6px rgba(0, 0, 0, 0.2);
  border-spacing: 0;
`;

export const TableHeader = styled.th`
  background-color: #f5f5f5;
  text-align: left;
  border-bottom: 1px solid #ddd;
  padding: 16px 8px;
`;

export const TableRow = styled.tr`
  cursor: pointer;
  height: 30px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: rgb(115, 206, 255);
  }
`;

export const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 8px;

  &:nth-child(2):hover {
    text-decoration: underline;
    text-decoration-color: black;
  }
`;
