import React, { ChangeEvent, FC, useCallback } from 'react';
import { animated, useTransition } from 'react-spring';
import { Category } from 'server/entities';
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

  function tpmt(x: number) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
  }

  const transitions = useTransition(activeTab, {
    from: {
      transform: 'translate3d(0,25px,0)',
      opacity: 0,
    },
    enter: {
      transform: 'translate3d(0,0px,0)',
      opacity: 1,
    },
    leave: {
      transform: 'translate3d(0,-25px,0)',
      opacity: 0,
    },
    config: {
      duration: 680,
      easing: (t: number) => 1 - tpmt(t),
    },
  });

  const categoriesWithAllTab = useCallback(() => {
    return servicesUtils(config.categories).getAllTabServices({
      withRest: true,
    });
  }, [config.categories]);

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
        catagories={categoriesWithAllTab()}
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
            {transitions((style, item) => (
              <AnimatedWrap style={style}>
                <ServiceList
                  items={
                    categoriesWithAllTab().find(c => c.id === item)?.services ||
                    []
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
