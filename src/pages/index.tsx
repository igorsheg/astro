import React, { ChangeEvent, FC, useEffect } from 'react';
import { animated, useTransition } from 'react-spring';
import { Category } from 'server/entities';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import Padder from 'src/components/padder';
import { ServiceList } from 'src/components/service';
import NavBar from 'src/components/topbar';
import { configStore, serviceStore, uiStore } from 'src/stores';
import { servicesUtils } from 'src/utils';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
const Index: FC = () => {
  const { activeTab, searchTerm, setUiStore } = uiStore();
  const { data: config } = configStore();
  const { data: services, sync: syncServices } = serviceStore();

  useEffect(() => {
    syncServices();
  }, [syncServices]);

  if (!config) {
    return null;
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
      tension: 300,
    },
  });

  const categoriesWithAllTab = servicesUtils(
    config.categories,
  ).getAllTabServices({
    withRest: true,
  });

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
        onSearchTermChange={debounce(ev => onSearchTermChangeHandler(ev), 200)}
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
                    activeTab === 0
                      ? services || []
                      : services?.filter(s => s.category.id === activeTab) || []
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
