import { CheckIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { FC, SyntheticEvent } from 'react';
import { MenuItem as BaseMenuItem } from 'reakit/Menu';
import styled from 'styled-components';

type Props = {
  onClick?: (ev: SyntheticEvent) => void | Promise<void>;
  selected?: boolean;
  disabled?: boolean;
  to?: string;
  href?: string;
  target?: '_blank';
  as?: string | React.ComponentType<any>;
};

const MenuItem: FC<Props> = ({
  onClick,
  children,
  selected,
  disabled,
  as,
  ...rest
}) => {
  return (
    <BaseMenuItem
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...rest}
    >
      {props => (
        <MenuAnchor as={onClick ? 'button' : as} {...props}>
          {selected !== undefined && (
            <>
              {selected ? <CheckIcon /> : <Spacer />}
              &nbsp;
            </>
          )}
          {children}
        </MenuAnchor>
      )}
    </BaseMenuItem>
  );
};

const Spacer = styled.div`
  width: 24px;
  height: 24px;
`;

export const MenuAnchor = styled.a<{ disabled: boolean }>`
  display: flex;
  margin: 0;
  border: 0;
  padding: 6px 12px;
  width: 100%;
  min-height: 30px;
  height: 30px;
  background: none;
  color: ${props =>
    props.disabled ? props.theme.text.secondary : props.theme.text.primary};
  justify-content: left;
  align-items: center;
  font-size: 14px;
  border-radius: 4px;
  cursor: default;
  user-select: none;
  svg:not(:last-child) {
    margin-right: 8px;
  }
  svg {
    height: 14px;
    margin: 1px 0 0 0;
    vertical-align: middle;
    flex-shrink: 0;
    opacity: ${props => (props.disabled ? '.5' : 1)};
  }
  ${props =>
    props.disabled
      ? 'pointer-events: none;'
      : `
  &:hover,
  &.focus-visible {
    color: white;
    background: ${props.theme.accent.primary};
    box-shadow: none;
    cursor: pointer;
    svg {
      fill: ${props.theme.text.primary};
    }
  }
  &:focus {
    color: white;
    background: ${props.theme.accent.primary};
  }
  `};
`;

export default MenuItem;
