import React, { FC } from 'react';
import { animated, useTransition } from 'react-spring';
import { SAMPLE_CONFIG, SAMPLE_THEMES } from 'server/config/seed-data';
import { Config } from 'server/entities';
import fetcher from 'shared/utils/fetcher';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import NavBarPanel from 'src/components/navbar';
import Padder from 'src/components/padder';
import ServiceList from 'src/components/service-list';
import { configStore, localSrorageStore } from 'src/stores';
import styled from 'styled-components';

const Index: FC = () => {
  const { activeTheme, setUi, activeTab } = localSrorageStore();
  const { data: config, mutate: mutateConfig } = configStore();

  const changeThemeHandler = () => {
    setUi(d => {
      d.activeTheme =
        activeTheme === 'light'
          ? SAMPLE_THEMES.dark.id
          : SAMPLE_THEMES.light.id;
    });
  };

  const changeTitleHandler = () => {
    if (config) {
      const rand = `${Math.random()}`;
      mutateConfig(d => {
        if (d.data) {
          d.data.title = rand;
        }
      });
      fetcher<Config>(['Config', SAMPLE_CONFIG.id], { data: { title: rand } });
    }
  };

  const transitions = useTransition(activeTab, item => item.name, {
    from: {
      transform: 'translate3d(0,15px,0)',
      opacity: 0,
    },
    enter: {
      transform: 'translate3d(0,0px,0)',
      opacity: 1,
    },
    leave: {
      transform: 'translate3d(0,-15px,0)',
      opacity: 0,
    },
    config: { tension: 500, friction: 30 },
  });

  return (
    <>
      <NavBarPanel />
      <Padder y={204} />
      <Flex align="center" justify="center" column>
        <Grid>
          {/* {config.message && <MessageCard message={config.message} />} */}
          <Padder y={18} />
          <div>
            {transitions.map(
              ({ item, props, key }) =>
                item &&
                item.services && (
                  <AnimatedWrap key={key} style={props}>
                    <ServiceList
                      serviceGroupName={activeTab.name}
                      items={item.services}
                    />
                  </AnimatedWrap>
                ),
            )}
          </div>
        </Grid>
      </Flex>
    </>
  );
};

const AnimatedWrap = styled(animated.div)<{ hasMessage?: boolean }>`
  display: flex;
  width: 100%;
  position: absolute;
`;

export default Index;
