import { transparentize } from 'polished';
import React, { createElement, FC } from 'react';
import { SideBarMenuItem } from 'shared/types/internal';
import styled from 'styled-components';
import * as RadixIcons from '@radix-ui/react-icons';

interface MenuGroupProps {
  menuItems: SideBarMenuItem[];
  label: string;
  onMenuItemClick: (item: SideBarMenuItem) => void;
}
const MenuGroup: FC<MenuGroupProps> = ({
  menuItems,
  label,
  onMenuItemClick,
}) => {
  return (
    <Group>
      <h5>{label}</h5>
      <List>
        {menuItems.map(menuItem => {
          const Icon = RadixIcons[menuItem.icon];
          return (
            <MenuItem
              onClick={() => onMenuItemClick(menuItem)}
              key={menuItem.id}
            >
              {/* {RadixIcons[menuItem.icon]} */}
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
  h5 {
    font-size: 14px;
    margin: 0 0 12px 0;
    font-weight: 500;
    padding: 0;
    color: ${p => transparentize(0.5, p.theme.text.secondary)};
  }
`;
const List = styled.ul`
  padding: 0;
  margin: 0;
`;
const MenuItem = styled.li`
  font-size: 14px;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  svg {
    margin: 0 12px 0 0;
  }
`;

export default MenuGroup;
