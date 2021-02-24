import * as RadixIcons from '@radix-ui/react-icons';
import Button from 'src/components/button';
import Flex from 'src/components/flex';
import Padder from 'src/components/padder';
import SearchInput from 'src/components/search-input';
import Tabs from 'src/components/tabs';
import { transparentize } from 'polished';
import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';
import { configStore, localSrorageStore } from 'src/stores';
import { Category } from 'server/entities';
import { servicesUtils } from 'src/utils';

const Actions: FC = () => {
  const { data: config } = configStore();
  const { activeTab, setUi, searchTerm, activeTheme } = localSrorageStore();

  const onTabItemClick = (item: Category) => {
    setUi(d => {
      d.activeTab = item;
    });
  };

  const setThemeFun = () => {
    setUi(draft => {
      draft.activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
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

  const ThemeIcon =
    activeTheme === 'dark' ? <RadixIcons.SunIcon /> : <RadixIcons.MoonIcon />;

  const svc = servicesUtils(config.categories);
  const servicesWithAllTab = svc.getAllTabServices({ withRest: true });

  return (
    <StyledActions>
      <Tabs
        onItemClick={onTabItemClick}
        items={servicesWithAllTab}
        activeItem={activeTab}
      />
      <Flex align="center" justify="flex-end">
        {/* <Button skin="toogle">
          <RadixIcons.PlusIcon />
          <Padder x={6} />
          New Section
        </Button>
        <Padder x={12} /> */}

        <SearchInput value={searchTerm} onChange={onSearchTermChange} />
        {/* <Padder x={12} />
        <Button skin="toogle" type="button" onClick={setThemeFun}>
          {ThemeIcon}
        </Button> */}
      </Flex>
    </StyledActions>
  );
};

const StyledActions = styled.div`
  height: 60px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset 0 -1px 0 ${p => p.theme.border.primary};
`;

export default Actions;
