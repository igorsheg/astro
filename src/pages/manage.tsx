import React, { FC } from 'react';
import { animated, useTransition } from 'react-spring';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import { Header } from 'src/components/navbar';
import Padder from 'src/components/padder';
import ServiceList from 'src/components/service';
import { configStore, localSrorageStore } from 'src/stores';
import styled from 'styled-components';

const Manage: FC = () => {
  const { activeTheme, setUi, activeTab } = localSrorageStore();
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

  return (
    <>
      <HeaderWrap>
        <Header />
      </HeaderWrap>

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

const HeaderWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 991;
  width: 100vw;
`;

const AnimatedWrap = styled(animated.div)<{ hasMessage?: boolean }>`
  display: flex;
  width: 100%;
  position: absolute;
`;

export default Manage;
