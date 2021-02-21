import { transparentize } from 'polished';
import React, { FC } from 'react';
import styled from 'styled-components';
import Flex from 'src/components/flex';
import Padder from 'src/components/padder';
import { configStore, localSrorageStore, themeStore } from 'src/stores';
import { Config, Theme } from 'server/entities';
import { SAMPLE_THEMES } from 'server/config/seed-data';

export const Header: FC = () => {
  // const { config } = useConfigStore();
  // const { theme } = useUiStore();

  const { data: themes } = themeStore();
  const { data: config } = configStore();
  const { activeTheme } = localSrorageStore();

  const ctxTheme =
    themes?.find(theme => theme.id === activeTheme) ||
    SAMPLE_THEMES[activeTheme as keyof typeof SAMPLE_THEMES];

  if (!config) {
    return null;
  }

  return (
    <>
      <StyledNavbar>
        <Flex auto align="center">
          <Logo themeType={ctxTheme}>
            <img src="/logo.svg" />
          </Logo>
          <Padder x="18" />
          <Title column>
            <h1>{config.title}</h1>
            {config.subtitle && <h5>{config.subtitle}</h5>}
          </Title>
        </Flex>
      </StyledNavbar>
    </>
  );
};

const StyledNavbar = styled.nav`
  height: 96px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset 0 -1px 0 ${p => p.theme.border.primary};
`;

const Title = styled(Flex)`
  h1 {
    font-size: 20px;
    margin: 0;
  }
  h5 {
    margin: 0.3em 0 0 0;
    font-size: 14px;
  }
`;
const Logo = styled.div<{ themeType: Theme }>`
  img {
    filter: ${p => (p.themeType.id === 'dark' ? 'invert(0)' : 'invert(1)')};
    color: currentColor;
    width: 30px;
    height: 30px;
    display: block;
  }
`;

export default Header;
