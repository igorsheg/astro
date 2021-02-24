import React, { FC } from 'react';
import {
  Tooltip as Tip,
  TooltipReference,
  TooltipStateReturn,
} from 'reakit/Tooltip';
import styled from 'styled-components';

interface TooltipProps extends TooltipStateReturn {
  label: string;
}

const Tooltip: FC<TooltipProps> = ({ children, label, ...tooltip }) => {
  return (
    <>
      <StyledTip {...tooltip}>{label}</StyledTip>

      <TooltipReference {...tooltip}>{children}</TooltipReference>
    </>
  );
};

const StyledTip = styled(Tip)`
  font-size: 12px;
  z-index: 991;
  background: black;
  color: white;
  border-radius: 4px;
  padding: 1px 4px;
`;

export default Tooltip;
