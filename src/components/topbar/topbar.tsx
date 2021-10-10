import React, { ChangeEvent, FC } from 'react';
import { Category } from 'server/entities';
import { configStore, localSrorageStore } from 'src/stores';
import styled from 'styled-components';
import Flex from '../flex';
import SearchInput from '../search-input';
import Tabs from '../tabs';
import Actions from './actions';
import Panel from './panel';
import HeaderTitle from './title';

interface TopBarProps {
  catagories: Category[];
  onCategoryClick: (categoryId: Category['id']) => void;
  activeCategory: Category['id'];
  searchTerm: string;
  onSearchTermChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}
const TopBar: FC<TopBarProps> = ({
  catagories,
  onCategoryClick,
  activeCategory,
  searchTerm,
  onSearchTermChange,
}) => {
  const { activeTheme } = localSrorageStore();
  const { data: config } = configStore();

  if (!config) {
    return null;
  }

  return (
    <HeaderWrap>
      <Panel style={{ zIndex: 99999191, position: 'relative' }} height="96px">
        <HeaderTitle config={config} activeTheme={activeTheme} />
        <Actions />
      </Panel>
      <Panel height="60px">
        <Tabs
          onItemClick={onCategoryClick}
          items={catagories}
          activeItem={activeCategory}
        />
        <Flex align="center" justify="flex-end">
          <SearchInput
            height={30}
            growOnFocus
            value={searchTerm}
            onChange={onSearchTermChange}
          />
        </Flex>
      </Panel>
    </HeaderWrap>
  );
};

const HeaderWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 91;
  width: 100vw;
`;

export default TopBar;
