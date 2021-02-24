import { transparentize } from 'polished';
import React, { FC } from 'react';
import { Config } from 'server/entities';
import styled from 'styled-components';
import Flex from '../flex';
import { HeaderTitle } from '../navbar';

interface SidebarProps {
  config: Config;
  activeTheme: string;
}

const Sidebar: FC<SidebarProps> = ({ config, activeTheme }) => {
  return (
    <Panel>
      <Flex auto style={{ height: '96px' }}>
        <HeaderTitle activeTheme={activeTheme} config={config} />
      </Flex>
    </Panel>
  );
};

const Panel = styled.nav`
  height: 100vh;
  display: flex;
  width: 280px;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 30px;
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset -1px 0 0 ${p => p.theme.border.primary};
`;

export default Sidebar;
