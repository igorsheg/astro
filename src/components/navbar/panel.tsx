import React, { FC } from 'react';
import styled from 'styled-components';
import Actions from './actions';
import Header from './header';

const Panel: FC = () => {
  return (
    <Wrap>
      <Header />
      <Actions />
    </Wrap>
  );
};

const Wrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 991;
  width: 100vw;
`;

export default Panel;
