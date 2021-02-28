import React, { FC } from 'react';
import {
  Tooltip as Tip,
  TooltipReference,
  useTooltipState,
} from 'reakit/Tooltip';
import styled from 'styled-components';

interface TooltipProps {
  label: string;
  tabIndex: number;
}

const Tooltip: FC<TooltipProps> = ({ children, label, tabIndex }) => {
  const tool = useTooltipState({
    placement: 'auto',
    unstable_preventOverflow: true,
    gutter: 5,
    animated: 250,
  });

  return (
    <>
      <TooltipReference tabIndex={tabIndex} {...tool}>
        {children}
      </TooltipReference>
      <Tip {...tool}>
        <Wrap>{label}</Wrap>
      </Tip>
    </>
  );
};

const Wrap = styled.div`
  font-size: 12px;
  z-index: 991;
  background: black;
  color: white;
  border-radius: 4px;
  padding: 1px 4px;
  opacity: 0;
  transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);
  [data-enter] & {
    opacity: 1;
  }
`;

export default Tooltip;
