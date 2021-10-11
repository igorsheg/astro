import React, { ChangeEvent, FC, useEffect } from 'react';
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
  onCategoryClick: (categoryId: number) => void;
  activeCategoryId: number;
  searchTerm: string;
  onSearchTermChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}
const TopBar: FC<TopBarProps> = ({
  catagories,
  onCategoryClick,
  activeCategoryId,
  searchTerm,
  onSearchTermChange,
}) => {
  const { activeTheme } = localSrorageStore();
  const { data: config } = configStore();

  return (
    <HeaderWrap>
      <Panel style={{ zIndex: 99999191, position: 'relative' }} height="96px">
        {config && <HeaderTitle config={config} activeTheme={activeTheme} />}
        <Actions />
      </Panel>
      <Panel height="60px">
        <Tabs
          onItemClick={onCategoryClick}
          items={catagories}
          activeItem={activeCategoryId}
        />
        <Flex align="center" justify="flex-end">
          <SearchInput
            placeHolder="Search by service name..."
            height={36}
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
