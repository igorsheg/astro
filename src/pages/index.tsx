import debounce from 'lodash/debounce';
import React, { ChangeEvent, FC, useEffect } from 'react';
import { animated, useTransition } from 'react-spring';
import { Category } from 'server/entities';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import Padder from 'src/components/padder';
import { ServiceList } from 'src/components/service';
import NavBar from 'src/components/topbar';
import { configStore, serviceStore, themeStore, uiStore } from 'src/stores';
import { servicesUtils } from 'src/utils';
import styled from 'styled-components';
import { ModalIdentity, ModalTypes } from 'typings';
import dynamic from 'next/dynamic';

const ServiceModal = dynamic(() => import('src/modals/new-service'), {
  ssr: true,
});

const DeleteModal = dynamic(() => import('src/modals/delete-modal'), {
  ssr: false,
});

const CategoryModal = dynamic(() => import('src/modals/new-category'), {
  ssr: false,
});

const Index: FC = () => {
  const { activeModals, activeTab, searchTerm, setUiStore } = uiStore();
  const { data: config, sync: syncConfig } = configStore();
  const { data: services, sync: syncServices } = serviceStore();

  useEffect(() => {
    syncServices();
    syncConfig();
  }, []);

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

  const modalCloseRequest = (modal: ModalIdentity<any>) => {
    const ctxModalIndex = activeModals.findIndex(m => m.id === modal.id);
    setUiStore(d => {
      d.activeModals[ctxModalIndex].state = 'closed';
    });
    setTimeout(() => {
      setUiStore(d => {
        d.activeModals.splice(ctxModalIndex, 1);
      });
    }, 240);
  };

  const MODALS = {
    [ModalTypes['new-service']]: ServiceModal,
    [ModalTypes['new-category']]: CategoryModal,
    [ModalTypes['new-delete']]: DeleteModal,
  };

  if (!config) {
    return null;
  }
  const categoriesWithAllTab = servicesUtils(
    config.categories,
  ).getAllTabServices({
    withRest: true,
  });

  return (
    <>
      {activeModals.map(modal => {
        const CtxModal = MODALS[modal.label];
        return (
          <CtxModal
            key={modal.id}
            onRequestClose={modalCloseRequest}
            modalIdentity={modal}
          />
        );
      })}

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
            {transitions(style => (
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
