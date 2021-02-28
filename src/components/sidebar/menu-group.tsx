import * as RadixIcons from '@radix-ui/react-icons';
import { transparentize } from 'polished';
import React, { FC } from 'react';
import { SideBarMenuItem } from 'shared/types/internal';
import styled from 'styled-components';

interface MenuGroupProps {
  menuItems: SideBarMenuItem[];
  label?: string;
  activeSidebarMenuItemId: SideBarMenuItem['id'];
  onMenuItemClick: (item: SideBarMenuItem) => void;
}
const MenuGroup: FC<MenuGroupProps> = ({
  menuItems,
  activeSidebarMenuItemId,
  label,
  onMenuItemClick,
}) => {
  return (
    <Group>
      {label && <h5>{label}</h5>}
      <List>
        {menuItems.map(menuItem => {
          const Icon = RadixIcons[menuItem.icon];
          return (
            <MenuItem
              isActive={activeSidebarMenuItemId === menuItem.id.toLowerCase()}
              onClick={() => onMenuItemClick(menuItem)}
              key={menuItem.id}
            >
              <Icon />
              {menuItem.label}
            </MenuItem>
          );
        })}
      </List>
    </Group>
  );
};

const Group = styled.div`
  padding: 0 30px;
  font-weight: 500;
  width: 100%;
  h5 {
    font-size: 14px;
    margin: 0 0 12px 0;
    font-weight: 500;
    padding: 0;
    color: ${p => transparentize(0, p.theme.text.secondary)};
  }
`;
const List = styled.ul`
  padding: 0;
  width: 100%;
  margin: 0;
`;
const MenuItem = styled.li<{ isActive: boolean }>`
  font-size: 14px;
  height: 36px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  color: ${p => (p.isActive ? 'white' : undefined)};
  box-shadow: ${p =>
    p.isActive
      ? `12px 0 0 0 ${p.theme.accent.primary}, -12px 0 0 0 ${p.theme.accent.primary}`
      : `12px 0 0 0 ${transparentize(
          1,
          p.theme.accent.primary,
        )}, -12px 0 0 0 ${transparentize(1, p.theme.accent.primary)}`};
  background: ${p => (p.isActive ? p.theme.accent.primary : undefined)};

  transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);

  :hover {
    cursor: pointer;
    box-shadow: ${p =>
      !p.isActive
        ? `12px 0 0 0 ${p.theme.background.secondary}, -12px 0 0 0 ${p.theme.background.secondary}`
        : undefined};
    background: ${p =>
      !p.isActive ? p.theme.background.secondary : undefined};
  }
  svg {
    margin: 0 12px 0 0;
  }
`;

export default MenuGroup;
