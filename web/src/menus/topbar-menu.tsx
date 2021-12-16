import * as RadixIcons from "@radix-ui/react-icons";
import React, { FC, forwardRef } from "react";
import { MenuButton, MenuSeparator, useMenuState } from "reakit/Menu";
import Button from "../components/button";
import Flex from "../components/flex";
import { ContextMenu, MenuItem } from "../components/menu";
import { BASE_STATE } from "../consts/entityBaseState";
import { localSrorageStore, uiStore } from "../stores";
import generateUuid from "../utils/generateUuid";
import styled from "styled-components";
import { EntityTypes, ModalTypes } from "../types";

const TopbarMenu: FC = () => {
  const { setUiStore, activeModals } = uiStore();
  const menu = useMenuState({
    animated: 120,
    modal: false,
  });

  const expandExistingModal = (index: number) =>
    setUiStore((d) => {
      d.activeModals[index].state = "expnanded";
    });

  const createNewServiceModal = (modalType: ModalTypes) => {
    setUiStore((d) => {
      d.activeModals.push({
        id: generateUuid(),
        label: modalType,
        state: "expnanded",
        title: "Create New Service",
        entityType: "services",
        baseState: { ...BASE_STATE.SERVICE },
        draft: { ...BASE_STATE.SERVICE },
      });
    });
  };
  const createNewCategoryModal = (modalType: ModalTypes) => {
    setUiStore((d) => {
      d.activeModals.push({
        id: generateUuid(),
        label: modalType,
        state: "expnanded",
        title: "Create New Category",
        entityType: "categories",
        baseState: BASE_STATE.CATEGORY,
        draft: BASE_STATE.CATEGORY,
      });
    });
  };

  const createNewModal = (modalType: ModalTypes, entityType: EntityTypes) => {
    const ctxModalIndex = activeModals.findIndex((d) => d.label === modalType);
    const ctxModalExists = ctxModalIndex !== -1;

    ctxModalExists
      ? expandExistingModal(ctxModalIndex)
      : entityType === "services"
      ? createNewServiceModal(modalType)
      : entityType === "categories"
      ? createNewCategoryModal(modalType)
      : false;
  };

  return (
    <>
      <MenuButton focusable {...menu}>
        {(props) => (
          <Button
            hierarchy="secondary"
            as="div"
            tabIndex={0}
            aria-label="View Service Menu"
            {...props}
          >
            <RadixIcons.DotsHorizontalIcon />
          </Button>
        )}
      </MenuButton>
      <ContextMenu aria-label="Manage Astro Menu" {...menu}>
        <MenuItem
          focusable
          {...menu}
          onClick={() => createNewModal(ModalTypes["new-service"], "services")}
        >
          New Service
        </MenuItem>
        <MenuItem
          onClick={() =>
            createNewModal(ModalTypes["new-category"], "categories")
          }
          {...menu}
        >
          New Category
        </MenuItem>

        <Seperator />

        <MenuItem closeOnClick={false} {...menu} as={ApperanceMenu} />
      </ContextMenu>
    </>
  );
};

const ApperanceMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const menu = useMenuState();
  const { setLocalStorage, activeThemeId } = localSrorageStore();

  const setThemeFun = (theme: string) => {
    setLocalStorage((draft) => {
      draft.activeThemeId = theme;
    });
  };

  return (
    <>
      <MenuButton ref={ref} {...menu} {...props}>
        <Flex justify="space-between" auto>
          Apperance <RadixIcons.TriangleRightIcon />
        </Flex>
      </MenuButton>
      <ContextMenu {...menu} aria-label="Set Theme Menu">
        <MenuItem {...menu} as="checbox" onClick={() => setThemeFun("light")}>
          <Flex justify="space-between" auto>
            Light
            {activeThemeId === "light" && (
              <RadixIcons.CheckIcon role="selected-icon" />
            )}
          </Flex>
        </MenuItem>
        <MenuItem {...menu} onClick={() => setThemeFun("dark")}>
          <Flex justify="space-between" auto>
            Dark
            {activeThemeId === "dark" && (
              <RadixIcons.CheckIcon role="selected-icon" />
            )}
          </Flex>
        </MenuItem>
      </ContextMenu>
    </>
  );
});

const Seperator = styled(MenuSeparator)`
  height: 12px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  position: relative;
  width: 100%;
  display: flex;

  :after {
    content: "";
    height: 1px;
    position: absolute;
    top: 6px;
    left: 12px;
    width: calc(100% - 24px);
    background: ${(p) => p.theme.border.primary};
  }
`;

export default TopbarMenu;
