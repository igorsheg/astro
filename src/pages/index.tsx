import React, { ChangeEvent, FC } from 'react';
import { animated, useTransition } from 'react-spring';
import { Category } from 'server/entities';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import NavBar from 'src/components/topbar';
import Padder from 'src/components/padder';
import { ServiceList } from 'src/components/service';
import { configStore, localSrorageStore } from 'src/stores';
import { servicesUtils } from 'src/utils';
import styled from 'styled-components';

const Index: FC = () => {
  const { activeTheme, setUi, activeTab, searchTerm } = localSrorageStore();
  const { data: config, mutate: mutateConfig } = configStore();

  const onTabItemClick = (item: Category) => {
    setUi(d => {
      d.activeTab = item;
    });
  };

  const onSearchTermChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setUi(d => {
      d.searchTerm = ev.target.value;
    });
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

  if (!config) {
    return null;
  }

  const servicesWithAllTab = servicesUtils(
    config.categories,
  ).getAllTabServices({ withRest: true });

  return (
    <>
      <NavBar />
      <Padder y={204} />
      <Flex align="center" justify="center" column>
        <Grid>
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

const HeaderWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
`;

const AnimatedWrap = styled(animated.div)<{ hasMessage?: boolean }>`
  display: flex;
  width: 100%;
  position: absolute;
`;

export default Index;
