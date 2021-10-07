import { NextPage } from 'next';
import React, { FC, useState } from 'react';
import { Category, Config, Service } from 'server/entities';
import Flex from 'src/components/flex';
import Padder from 'src/components/padder';
import SearchInput from 'src/components/search-input';
import { HeaderTitle } from 'src/components/topbar';
import { configStore, localSrorageStore, serviceStore } from 'src/stores';
import styled from 'styled-components';

const SIDEBAR_STATIC_DATA = [
  {
    type: 'category',
    label: 'Settings',
    children: [],
  },
];

const Manage: NextPage = () => {
  const { activeTheme } = localSrorageStore();
  const { data: config } = configStore();

  if (!config) {
    return null;
  }
  const services = config.categories.reduce((prev: Service[], current) => {
    if (current && current.services) {
      prev.push(...current.services);
    }
    return prev;
  }, []);

  return (
    <SideBar services={services} config={config} activeTheme={activeTheme} />
  );
};

interface SidebarProps {
  config: Config;
  services: Service[];
  activeTheme: string;
}

const SideBar: FC<SidebarProps> = ({ ...props }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categoriesList = {
    type: 'category',
    label: 'Categories',
    children: props.config.categories,
  };

  const servicesList = {
    type: 'category',
    label: 'Services',
    children: props.services,
  };

  const searchTermChangeHandler = () => {
    return false;
  };

  return (
    <SidebarWrap>
      <HeaderTitleWrap>
        <HeaderTitle {...props} />
      </HeaderTitleWrap>
      <SearchWrap>
        <SearchInput value={searchTerm} onChange={searchTermChangeHandler} />
      </SearchWrap>
      <SidebarMenu items={[categoriesList, servicesList]} />
    </SidebarWrap>
  );
};

interface SidebarMenuProps {
  items: {
    type: string;
    label: string;
    children: Category[] | Service[];
  }[];
}

const SidebarMenu: FC<SidebarMenuProps> = ({ items }) => {
  return (
    <SidebarMenuWrap>
      {items.map(
        item =>
          item.type === 'category' && (
            <>
              <SidebarCategory>
                <h5>{item.label}</h5>
                {item.children.map((itemChild: Service | Category) => (
                  <CategoryItem key={itemChild.name} item={itemChild} />
                ))}
              </SidebarCategory>
            </>
          ),
      )}
    </SidebarMenuWrap>
  );
};

const CategoryItem: FC<{ item: { name: string } }> = ({ item }) => {
  return (
    <CategoryItemWrap>
      <span key={item.name}>{item.name}</span>
    </CategoryItemWrap>
  );
};

const SidebarWrap = styled(Flex)`
  flex-direction: column;
  width: calc(100vw - (100vw / 1.6));
  height: 100vh;
  padding: 0;
  margin: 0;
  background: ${p => p.theme.background.primary};
  box-shadow: 1px 0 0 ${p => p.theme.border.secondary};
`;

const HeaderTitleWrap = styled(Flex)`
  height: 96px;
  min-height: 96px;
  padding: 0 30px;
  box-shadow: inset 0 -1px 0 ${p => p.theme.border.secondary};
`;
const SearchWrap = styled(Flex)`
  height: 60px;
  min-height: 60px;
`;

const SidebarMenuWrap = styled(Flex)`
  flex-direction: column;
  overflow-y: scroll;
`;
const SidebarCategory = styled(Flex)`
  flex-direction: column;
  min-height: min-content;
  h5 {
    position: sticky;
    height: 42px;
    box-shadow: inset 0 -1px 0 ${p => p.theme.border.secondary},
      inset 0 1px 0 ${p => p.theme.border.secondary};
    padding: 0 18px;
    top: 0;
    transform: translateY(-1px);
    min-height: 42px;
    background: ${p => p.theme.background.secondary};
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: ${p => p.theme.text.secondary};
  }
`;
const CategoryItemWrap = styled.a`
  display: flex;
  border-radius: 4px;
  height: 42px;
  align-items: center;
  min-height: 30px;
  padding: 0 18px;
  :hover {
    background: ${p => p.theme.background.secondary};
    cursor: pointer;
  }
  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

export default Manage;
