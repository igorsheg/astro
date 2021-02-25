import * as RadixIcons from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { animated, useSpring } from 'react-spring';
import { useTooltipState } from 'reakit/Tooltip';
import Tooltip from 'src/components/tooltip';
import { configStore, localSrorageStore } from 'src/stores';
import styled from 'styled-components';
import Button from '../button';
import Flex from '../flex';

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
      <Button onClick={() => router.push('/manage/:service')} skin="default">
        Manage
      </Button>

      <Devider />

      <Tooltip
        label={`Switch to ${activeTheme === 'dark' ? 'Light' : 'Dark'} Theme`}
        {...tooltip}
      >
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
      </Tooltip>
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
