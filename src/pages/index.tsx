import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import React, { ChangeEvent, FC, useCallback, useEffect } from 'react';
import toast, { ToastOptions } from 'react-hot-toast';
import { animated, useTransition } from 'react-spring';
import Flex from 'src/components/flex';
import Loader from 'src/components/fullpage-loader';
import Grid from 'src/components/grid';
import Padder from 'src/components/padder';
import { ServiceList } from 'src/components/service';
import { AstroToast } from 'src/components/toast';
import NavBar from 'src/components/topbar';
import { categoryStore, configStore, uiStore } from 'src/stores';
import { servicesUtils } from 'src/utils';
import styled from 'styled-components';
import { ModalIdentity, ModalTypes } from 'typings';
import Dock from 'src/components/dock';

const ServiceModal = dynamic(() => import('src/modals/service'), {
  ssr: true,
});

const DeleteModal = dynamic(() => import('src/modals/delete'), {
  ssr: false,
});

const CategoryModal = dynamic(() => import('src/modals/category'), {
  ssr: false,
});

const ServiceMonitorModal = dynamic(
  () => import('src/modals/service-monitor'),
  {
    ssr: false,
  },
);

const TOAST_OPTS: ToastOptions = {
  duration: 6000,
};

const Index: FC = () => {
  const { activeModals, activeTabId, searchTerm, setUiStore } = uiStore();
  const { sync: syncConfig } = configStore();
  const { data: categories, sync: syncCategories } = categoryStore();

  useEffect(() => {
    syncConfig();
    syncCategories();
  }, []);

  const onCategoryClickHandler = (categoryId: string) => {
    setUiStore(d => {
      d.activeTabId = categoryId;
    });
  };

  const onSearchTermChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setUiStore(d => {
      d.searchTerm = ev.target.value;
    });
  };

  const modalCloseRequest = (modal: ModalIdentity<unknown>) => {
    const ctxModalIndex = activeModals.findIndex(m => m.id === modal.id);
    setUiStore(d => {
      d.activeModals[ctxModalIndex].state = 'closed';
    });
    setTimeout(() => {
      setUiStore(d => {
        d.activeModals.splice(ctxModalIndex, 1);
      });
    }, 240);

    if (modal.closeNotification) {
      const { type, message } = modal.closeNotification;
      type === 'success'
        ? toast.success(message, { ...TOAST_OPTS })
        : toast(message, { ...TOAST_OPTS });
    }
  };

  const MODALS = {
    [ModalTypes['new-service']]: ServiceModal,
    [ModalTypes['new-category']]: CategoryModal,
    [ModalTypes['new-delete']]: DeleteModal,
    [ModalTypes['edit-service']]: ServiceModal,
    [ModalTypes['edit-category']]: CategoryModal,
    [ModalTypes['service-monitor']]: ServiceMonitorModal,
  };

  const categoriesWithAllTab = useCallback(() => {
    if (!categories?.length) {
      return [];
    } else {
      return servicesUtils(categories).getAllTabServices({
        withRest: true,
      });
    }
  }, [categories]);

  const activeTabIndex = categoriesWithAllTab().findIndex(
    c => c.id === activeTabId,
  );

  const transitions = useTransition(activeTabIndex, {
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

  const pages = useCallback(
    style => {
      return categoriesWithAllTab().map(category => (
        <AnimatedWrap key={category.id} style={style}>
          <ServiceList items={category.services || []} />
        </AnimatedWrap>
      ));
    },
    [categories],
  );

  if (!categories) return <Loader />;
  return (
    <>
      <Dock />
      <AstroToast />
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
        catagories={categoriesWithAllTab()}
        activeCategoryId={activeTabId}
        onCategoryClick={onCategoryClickHandler}
        searchTerm={searchTerm}
        onSearchTermChange={debounce(ev => onSearchTermChangeHandler(ev), 50)}
      />

      <Padder y={204} />
      <Flex align="center" justify="center" column>
        <Grid>
          <Padder y={18} />
          <div>
            {transitions((style, i) => {
              return pages(style)[i];
            })}
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
