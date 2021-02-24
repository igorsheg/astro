import React, { ChangeEvent, FC } from 'react';
import { Category } from 'server/entities';
import { configStore, localSrorageStore } from 'src/stores';
import { servicesUtils } from 'src/utils';
import styled from 'styled-components';
import Flex from '../flex';
import SearchInput from '../search-input';
import Tabs from '../tabs';
import Actions from './actions';
import Panel from './panel';
import HeaderTitle from './title';

const TopBar: FC = () => {
  const { activeTheme, setUi, activeTab, searchTerm } = localSrorageStore();
  const { data: config, mutate: mutateConfig } = configStore();

  const onTabItemClick = (item: Category) => {
    setUi(d => {
      d.activeTab = item;
    });
  };

  const onSearchTermChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setUi(d => {
      d.searchTerm = ev.target.value;
    });
  };

  if (!config) {
    return null;
  }

  const servicesWithAllTab = servicesUtils(
    config.categories,
  ).getAllTabServices({ withRest: true });

  return (
    <HeaderWrap>
      <Panel style={{ zIndex: 99999191, position: 'relative' }} height="96px">
        <HeaderTitle config={config} activeTheme={activeTheme} />
        <Actions />
      </Panel>
      <Panel height="60px">
        <Tabs
          onItemClick={onTabItemClick}
          items={servicesWithAllTab}
          activeItem={activeTab}
        />
        <Flex align="center" justify="flex-end">
          <SearchInput value={searchTerm} onChange={onSearchTermChange} />
        </Flex>
      </Panel>
    </HeaderWrap>
  );
};

const HeaderWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
`;

export default TopBar;
