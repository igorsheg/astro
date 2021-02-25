import React, { FC } from 'react';
import { animated, useTransition } from 'react-spring';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import Padder from 'src/components/padder';
import { ServiceList } from 'src/components/service';
import NavBar from 'src/components/topbar';
import { configStore, localSrorageStore } from 'src/stores';
import styled from 'styled-components';

const Index: FC = () => {
  const { activeTheme, setUi, activeTab, searchTerm } = localSrorageStore();
  const { data: config, mutate: mutateConfig } = configStore();

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

const AnimatedWrap = styled(animated.div)<{ hasMessage?: boolean }>`
  display: flex;
  width: 100%;
  position: absolute;
`;

export default Index;
