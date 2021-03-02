import * as React from 'react';
import { FC, SyntheticEvent } from 'react';
import { MenuItem as BaseMenuItem, MenuItemOptions } from 'reakit/Menu';
import styled from 'styled-components';

interface Props extends MenuItemOptions {
  onClick?: (ev: SyntheticEvent) => void | Promise<void>;
  selected?: boolean;
  disabled?: boolean;
  to?: string;
  href?: string;
  target?: '_blank';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | React.ComponentType<any>;
  closeOnClick?: boolean;
}

const MenuItem: FC<Props> = ({
  onClick,
  children,
  disabled,
  as,
  closeOnClick = true,
  ...rest
}) => {
  const clickMiddleware = (ev: SyntheticEvent) => {
    if (onClick) {
      onClick(ev);
    }
    if (rest && rest.hide && closeOnClick) {
      rest.hide();
    }
  };

  return (
    <BaseMenuItem
      onClick={disabled ? undefined : clickMiddleware}
      disabled={disabled}
      {...rest}
    >
      {props => (
        <MenuAnchor as={onClick ? 'button' : as} {...props}>
          {children}
        </MenuAnchor>
      )}
    </BaseMenuItem>
  );
};

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
