import styled from 'styled-components';

const Grid = styled.section<{ sidebar?: boolean }>`
  max-width: 1440px;
  position: relative;
  width: calc(100% - 96px);
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export default Grid;
