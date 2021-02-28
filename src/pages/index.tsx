import React, { ChangeEvent, FC } from 'react';
import { animated, useTransition } from 'react-spring';
import { Category, Service } from 'server/entities';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import Padder from 'src/components/padder';
import { ServiceList } from 'src/components/service';
import NavBar from 'src/components/topbar';
import { configStore, uiStore } from 'src/stores';
import { servicesUtils } from 'src/utils';
import styled from 'styled-components';

const Index: FC = () => {
  const { activeTab, searchTerm, setUiStore } = uiStore();
  const { data: config } = configStore();

  if (!config) {
    return null;
  }

  const transitions = useTransition(activeTab, item => item, {
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

  const categoriesWithAllTab = servicesUtils(
    config.categories,
  ).getAllTabServices({ withRest: true });

  const onCategoryClickHandler = (category: Category['id']) => {
    setUiStore(d => {
      d.activeTab = category;
    });
  };

  const onSearchTermChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setUiStore(d => {
      d.searchTerm = ev.target.value;
    });
  };

  return (
    <>
      <NavBar
        catagories={categoriesWithAllTab}
        activeCategory={activeTab}
        onCategoryClick={onCategoryClickHandler}
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChangeHandler}
      />
      <Padder y={204} />
      <Flex align="center" justify="center" column>
        <Grid>
          <Padder y={18} />
          <div>
            {transitions.map(({ item, props, key }) => (
              <AnimatedWrap key={key} style={props}>
                <ServiceList
                  items={
                    categoriesWithAllTab.find(c => c.id === item)
                      ?.services as Service[]
                  }
                />
              </AnimatedWrap>
            ))}
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
