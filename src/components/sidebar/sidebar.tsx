import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import { transparentize } from 'polished';
import React, { FC } from 'react';
import { Config } from 'server/entities';
import { SideBarMenuItem } from 'shared/types/internal';
import styled from 'styled-components';
import Flex from '../flex';
import MenuGroup from './menu-group';

interface SidebarProps {
  config: Config;
  activeTheme: string;
  activeSidebarMenuItemId: SideBarMenuItem['id'];
  onMenuItemClick: (item: SideBarMenuItem) => void;
  menuItems: SideBarMenuItem[];
}

const Sidebar: FC<SidebarProps> = ({
  menuItems,
  activeSidebarMenuItemId,
  onMenuItemClick,
}) => {
  const router = useRouter();

  return (
    <Panel>
      <LogoTop>
        <button onClick={() => router.back()}>
          <ArrowLeftIcon />
          Back to Homepage
        </button>
      </LogoTop>
      <MenuGroup
        activeSidebarMenuItemId={activeSidebarMenuItemId}
        onMenuItemClick={onMenuItemClick}
        menuItems={menuItems}
      />
    </Panel>
  );
};

const LogoTop = styled(Flex)`
  padding: 0 30px;
  height: 96px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  button {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    font-size: 14px;
    color: ${p => p.theme.text.secondary};
    :hover {
      color: ${p => p.theme.text.primary};
      cursor: pointer;
    }
    svg {
      margin: 0 6px 0 0;
    }
  }
`;

const Panel = styled.nav`
  height: 100vh;
  display: flex;
  width: 280px;
  min-width: 280px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset -1px 0 0 ${p => p.theme.border.primary};
`;

export default Sidebar;
