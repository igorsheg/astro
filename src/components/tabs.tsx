import * as RadixIcons from '@radix-ui/react-icons';
import React, { FC } from 'react';
import { Category } from 'server/entities';
import styled, { css } from 'styled-components';

interface TabsProps {
  items: Category[];
  activeItem: Category['id'];
  onItemClick: (item: number) => void;
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
}

const Tab: FC<TabProps> = ({ item, activeItem, onItemClick }) => {
  const Icon = RadixIcons[item.icon];

  return (
    <StyledTab
      onClick={() => onItemClick(item.id as number)}
      isActive={item.id === activeItem}
      hasSeperator={false}
    >
      <Icon />
      <span>{item.name}</span>
    </StyledTab>
  );
};

const StyledUl = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 14px;
  margin: 0;
  padding: 0;
`;

const withSeperatorCss = css`
  margin: 0 30px 0 0;
  :after {
    content: '';
    position: absolute;
    right: -15px;
    height: 60%;
    width: 1px;
    background: ${p => p.theme.border.primary};
  }
`;

const StyledTab = styled.li<{ isActive: boolean; hasSeperator: boolean }>`
  align-items: center;
  position: relative;
  display: flex;
  padding: 9px;
  height: 30px;
  margin: 0 6px 0 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  background: ${p => (p.isActive ? p.theme.background.ternary : 'transparent')};
  ${p => p.hasSeperator && withSeperatorCss}

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
