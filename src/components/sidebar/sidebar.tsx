import { transparentize } from 'polished';
import React, { FC } from 'react';
import { Config } from 'server/entities';
import { SideBarMenuItem } from 'shared/types/internal';
import styled from 'styled-components';
import Flex from '../flex';
import Padder from '../padder';
import { HeaderTitle } from '../topbar';
import MenuGroup from './menu-group';

interface SidebarProps {
  config: Config;
  activeTheme: string;
}

const MENU_ITEMS: SideBarMenuItem[] = [
  { id: 'Service', label: 'Services', icon: 'SunIcon' },
  { id: 'Category', label: 'Categories', icon: 'SunIcon' },
  { id: 'Note', label: 'Notes', icon: 'SwitchIcon' },
];

const onMenuItemClickHandler = (menuItem: SideBarMenuItem) => {
  console.log(menuItem);
};

const Sidebar: FC<SidebarProps> = ({ config, activeTheme }) => {
  return (
    <Panel>
      <LogoTop>
        <HeaderTitle activeTheme={activeTheme} config={config} />
      </LogoTop>
      <Padder y={30} />
      <MenuGroup
        onMenuItemClick={onMenuItemClickHandler}
        label="General"
        menuItems={MENU_ITEMS}
      />
    </Panel>
  );
};

const LogoTop = styled(Flex)`
  box-shadow: inset 0px -1px 0 ${p => p.theme.border.primary};
  padding: 0 30px;
  height: 120px;
  width: 100%;
`;

const Panel = styled.nav`
  height: 100vh;
  display: flex;
  width: 280px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  /* padding: 0 30px; */
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset -1px 0 0 ${p => p.theme.border.primary};
`;

export default Sidebar;
