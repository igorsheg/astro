import * as RadixIcons from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { animated, useSpring } from 'react-spring';
import { configStore, localSrorageStore } from 'src/stores';
import styled from 'styled-components';
import Button from '../button';
import Flex from '../flex';
import Padder from '../padder';
import ServiceMenu from '../service/menu';
import NavBarMenu from './menu';
import { Tooltip, TooltipReference, useTooltipState } from 'reakit/Tooltip';

const Actions: FC = () => {
  const { data: config } = configStore();
  const { activeTheme, setUi } = localSrorageStore();
  const tooltip = useTooltipState({
    placement: 'auto',
    unstable_preventOverflow: true,
  });

  const router = useRouter();

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
    <Flex style={{ zIndex: 999999991 }}>
      <Button skin="default">New Service</Button>

      <Padder x={12} />

      <NavBarMenu onChange={() => false} />

      <Devider />

      <Tooltip style={{ zIndex: 9991, fontSize: 12 }} {...tooltip}>
        Switch to {activeTheme === 'dark' ? 'Light' : 'Dark'} Theme
      </Tooltip>

      <TooltipReference
        {...tooltip}
        skin="default"
        hierarchy="secondary"
        type="button"
        onClick={setThemeFun}
        style={{ width: '36px', padding: '2px 0 0 0 ' }}
        as={Button}
      >
        <animated.div style={sunIconProps}>
          <RadixIcons.SunIcon />
        </animated.div>

        <animated.div style={moonIconProps}>
          <RadixIcons.MoonIcon />
        </animated.div>
      </TooltipReference>
    </Flex>
  );
};

const Devider = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  width: 24px;
  height: 30px;

  :after {
    content: '';
    position: absolute;
    right: 12px;
    height: 60%;
    width: 1px;
    background: ${p => p.theme.border.primary};
  }
`;

export default Actions;
