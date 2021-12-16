import debounce from "lodash/debounce";
import React, { ChangeEvent, FC, useCallback } from "react";
import toast from "react-hot-toast";
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import Dock from "../components/dock";
import Flex from "../components/flex";
import Loader from "../components/fullpage-loader";
import Grid from "../components/grid";
import Padder from "../components/padder";
import { ServiceList } from "../components/service";
import { AstroToast } from "../components/toast";
import NavBar from "../components/topbar";
import CategoryModal from "../modals/category";
import DeleteModal from "../modals/delete";
import ServiceModal from "../modals/service";
import ServiceMonitorModal from "../modals/service-monitor";
import { uiStore } from "../stores";
import { SessionStorageProps } from "../stores/uiStore";
import { Category, ModalProps, ModalTypes } from "../types";
import { fetcher, servicesUtils } from "../utils";
import { useQuery } from "react-query";



const Dashboard: FC = () => {
  const { activeModals, activeTabId, searchTerm, setUiStore } = uiStore();
  const { data: categories } = useQuery("categories", () =>
    fetcher<Category[]>(["categories"])
  );

  const onCategoryClickHandler = (categoryId: string) => {
    setUiStore((d) => {
      d.activeTabId = categoryId;
    });
  };

  const onSearchTermChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setUiStore((d) => {
      d.searchTerm = ev.target.value;
    });
  };

  const modalCloseRequest = (modal: ModalProps<any>) => {
    const ctxModalIndex = activeModals.findIndex((m) => m.id === modal.id);
    setUiStore((d: SessionStorageProps<any>) => {
      d.activeModals[ctxModalIndex].state = "closed";
    });
    setTimeout(() => {
      setUiStore((d) => {
        d.activeModals.splice(ctxModalIndex, 1);
      });
    }, 240);

    if (modal.closeNotification) {
      const { type, message } = modal.closeNotification;
      type === "success"
        ? toast.success(message, { duration: 6000 })
        : toast(message, { duration: 6000 });
    }
  };

  const MODALS = {
    [ModalTypes["new-service"]]: ServiceModal,
    [ModalTypes["new-category"]]: CategoryModal,
    [ModalTypes["new-delete"]]: DeleteModal,
    [ModalTypes["edit-service"]]: ServiceModal,
    [ModalTypes["edit-category"]]: CategoryModal,
    [ModalTypes["service-monitor"]]: ServiceMonitorModal,
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
    (c) => c.id === activeTabId
  );

  const transitions = useTransition(activeTabIndex, {
    from: {
      transform: "translate3d(0,25px,0)",
      opacity: 0,
    },
    enter: {
      transform: "translate3d(0,0px,0)",
      opacity: 1,
    },
    leave: {
      transform: "translate3d(0,-25px,0)",
      opacity: 0,
    },
    config: {
      tension: 300,
    },
  });

  const pages = useCallback(
    (style) => {
      return categoriesWithAllTab().map((category) => (
        <AnimatedWrap key={category.id} style={style}>
          <ServiceList items={category.services || []} />
        </AnimatedWrap>
      ));
    },
    [categories]
  );

  if (!categories) return <Loader />;
  return (
    <>
      <Dock />
      <AstroToast />
      
      {activeModals.map((modal) => {

        const CtxModal = MODALS[modal.label];

        return (
          <CtxModal
            key={modal.id}
            onRequestClose={modalCloseRequest}
            {...modal}
          />
        );
      })}
      <NavBar
        catagories={categoriesWithAllTab()}
        activeCategoryId={activeTabId}
        onCategoryClick={onCategoryClickHandler}
        searchTerm={searchTerm}
        onSearchTermChange={debounce((ev) => onSearchTermChangeHandler(ev), 50)}
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

export default Dashboard;
