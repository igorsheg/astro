import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import { transparentize } from 'polished';
import React, { FC } from 'react';
import { Config } from 'server/entities';
import { SideBarMenuItem } from 'shared/types/internal';
import styled from 'styled-components';
import Button from '../button';
import Flex from '../flex';
import Padder from '../padder';
import Tooltip from '../tooltip';
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
  config,
  activeSidebarMenuItemId,
  onMenuItemClick,
}) => {
  const router = useRouter();

  return (
    <Panel>
      <LogoTop>
        {/* <Flex column>
          <h1>{config.title}</h1>
          <p>Manage your homelab</p>
        </Flex> */}
        {/* <Tooltip label="Back to home"> */}
        <Button
          type="button"
          aria-label="Go Back Home"
          onClick={() => router.back()}
          hierarchy="secondary"
        >
          <ChevronLeftIcon />
          Back Home
        </Button>
        {/* </Tooltip> */}
      </LogoTop>
      <Padder y={30} />
      <MenuGroup
        activeSidebarMenuItemId={activeSidebarMenuItemId}
        onMenuItemClick={onMenuItemClick}
        label="General"
        menuItems={menuItems}
      />
    </Panel>
  );
};

const LogoTop = styled(Flex)`
  box-shadow: inset 0px -1px 0 ${p => p.theme.border.primary};
  padding: 0 30px;
  height: 96px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 20px;
    margin: 0;
    padding: 0;
  }
  p {
    font-size: 14px;
    color: ${p => p.theme.text.secondary};
    margin: 0;
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
  /* padding: 0 30px; */
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset -1px 0 0 ${p => p.theme.border.primary};
`;

export default Sidebar;
