import * as RadixIcons from '@radix-ui/react-icons';
import { darken } from 'polished';
import React, { FC } from 'react';
import { Category } from 'server/entities';
import styled, { css } from 'styled-components';

interface TabsProps {
  items: Category[];
  activeItem: Category['id'];
  onItemClick: (item: Category['id']) => void;
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
      onClick={() => onItemClick(item.id)}
      isActive={item.id === activeItem}
      hasSeperator={item.name === 'All Services'}
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
  padding: 12px;
  height: 30px;
  margin: 0 3px 0 0;
  border-radius: 30em;
  font-weight: 500;
  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  /* box-shadow: inset 1px 0 0 ${p => p.theme.border.primary}; */
  background: ${p =>
    p.isActive ? darken(0.08, p.theme.background.secondary) : 'transparent'};
  ${p => p.hasSeperator && withSeperatorCss}

  :hover {
    cursor: pointer;
  }
  ${p =>
    !p.isActive &&
    `:hover {
    
    background: ${p.theme.background.secondary}};
  }`}
  svg {
    margin: 0 6px 0 0;
  }
`;

export default Tabs;
