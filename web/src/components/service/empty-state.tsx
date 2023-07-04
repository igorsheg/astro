import { CookieIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { uiStore } from "../../stores";
import styled from "styled-components";
import Padder from "../padder";

const ServiceEmptyState: FC = () => {
  const { searchTerm } = uiStore();

  if (searchTerm && searchTerm.length) {
    return (
      <StyledEmpty>
        <MagnifyingGlassIcon />
        <Padder y={30} />
        <h2>No results</h2>
        <p>
          Couldn’t find any services matching <strong>{searchTerm}</strong>
        </p>
      </StyledEmpty>
    );
  } else {
    return (
      <StyledEmpty>
        <CookieIcon />
        <Padder y={30} />
        <h2>No services</h2>
        <p>You can add a new service from the top right menu</p>
      </StyledEmpty>
    );
  }
};

const StyledEmpty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 222px);
  align-items: center;
  h2 {
    margin: 0 0 18px 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
  }
  strong {
    font-weight: 600;
  }
  p {
    font-size: 14px;
    line-height: 18px;
    color: ${(p) => p.theme.text.secondary};
  }
  svg {
    color: ${(p) => p.theme.border.primary};
    width: 96px;
    height: 96px;
  }
`;

export default ServiceEmptyState;
