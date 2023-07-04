import React, { FC } from "react";
import styled from "styled-components";

const Kbd: FC = ({ children }) => {
  return <StyledKbd>{children}</StyledKbd>;
};

const StyledKbd = styled.span`
  font-size: 10px;
  position: relative;
  display: flex;
  border: 1px solid ${(p) => p.theme.border.primary};
  padding: 2px 9px;
  justify-content: center;
  border-radius: 4px;
`;

export default Kbd;
