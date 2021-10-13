import * as RadixIcons from '@radix-ui/react-icons';
import React, { FC } from 'react';
import { Category } from 'server/entities';
import { ALL_SERVICES_TAB } from 'src/consts/entityBaseState';
import CategoryMenu from 'src/menus/category-menu';
import styled from 'styled-components';

interface TabsProps {
  items: Category[];
  activeItem: Category['id'];
  onItemClick: (item: string) => void;
  inEditMode: boolean;
}

const Tabs: FC<TabsProps> = ({ items, ...props }) => {
  return (
    <StyledUl>
      {items.map(item => (
        <Tab key={item.name} item={item} {...props} />
      ))}
    </StyledUl>
  );
};

interface TabProps extends Omit<TabsProps, 'items'> {
  item: Category;
  inEditMode: boolean;
}

const Tab: FC<TabProps> = ({ item, activeItem, onItemClick, inEditMode }) => {
  const Icon = RadixIcons[item.icon];

  const eligbleForEdit = inEditMode && item.id !== ALL_SERVICES_TAB.id;

  return (
    <StyledTab isActive={item.id === activeItem}>
      <a onClick={() => onItemClick(item.id as string)}>
        <Icon />
        <span>{item.name}</span>
      </a>
      {eligbleForEdit && (
        <TabIctions>
          <CategoryMenu item={item} />
        </TabIctions>
      )}
    </StyledTab>
  );
};

const TabIctions = styled.div`
  display: flex;
  position: relative;
  button {
    border: none;
    svg {
      margin: 0 !important;
    }
  }
`;

const StyledUl = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 14px;
  margin: 0;
  position: relative;
  padding: 0;
`;

const StyledTab = styled.li<{ isActive: boolean }>`
  align-items: center;
  position: relative;
  display: flex;

  height: 30px;
  margin: 0 6px 0 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  background: ${p => (p.isActive ? p.theme.background.ternary : 'transparent')};

  a {
    padding: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :hover {
    cursor: pointer;
  }
  ${p =>
    !p.isActive &&
    `:hover {
    
    background: ${p.theme.background.ternary};
  }`}
  svg {
    margin: 0 6px 0 0;
  }
`;

export default Tabs;
