import * as RadixIcons from '@radix-ui/react-icons';
import { opacify, transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import { animated, useSpring, useTransition } from 'react-spring';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { Theme } from 'server/entities';
import { RadixIconTypes } from 'shared/types/radixIconsTypes';
import Flex from 'src/components/flex';
import Padder from 'src/components/padder';
import { configStore, localSrorageStore, themeStore } from 'src/stores';
import styled from 'styled-components';
import Button from '../button';
import { useRouter } from 'next/router';

export const Header: FC = () => {
  const { data: themes } = themeStore();
  const { data: config } = configStore();
  const { activeTheme, setUi } = localSrorageStore();

  const router = useRouter();

  const ctxTheme =
    themes?.find(theme => theme.id === activeTheme) ||
    SAMPLE_THEMES[activeTheme as keyof typeof SAMPLE_THEMES];

  if (!config) {
    return null;
  }

  const setThemeFun = () => {
    setUi(draft => {
      draft.activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    });
  };

  const sunIconProps = useSpring({
    config: { tension: 300 },
    position: 'absolute',
    opacity: activeTheme === 'dark' ? 1 : 0,
    transform: activeTheme === 'dark' ? 'translateY(0px)' : 'translateY(30px)',
  });
  const moonIconProps = useSpring({
    position: 'absolute',
    config: { tension: 300 },
    opacity: activeTheme === 'light' ? 1 : 0,
    transform: activeTheme === 'light' ? 'translateY(0px)' : 'translateY(30px)',
  });

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
        <Flex>
          <Button
            skin="default"
            hierarchy="secondary"
            type="button"
            onClick={setThemeFun}
            style={{ width: '36px', padding: '2px 0 0 0 ' }}
          >
            <animated.div style={sunIconProps}>
              <RadixIcons.SunIcon />
            </animated.div>

            <animated.div style={moonIconProps}>
              <RadixIcons.MoonIcon />
            </animated.div>
          </Button>
          <Devider />
          <Button onClick={() => router.push('/manage')} skin="default">
            Manage
          </Button>
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

const Devider = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  width: 30px;
  height: 30px;

  :after {
    content: '';
    position: absolute;
    right: 15px;
    height: 60%;
    width: 1px;
    background: ${p => p.theme.border.primary};
  }
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
