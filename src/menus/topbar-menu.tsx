import * as RadixIcons from '@radix-ui/react-icons';
import React, { FC, forwardRef } from 'react';
import { MenuButton, MenuSeparator, useMenuState } from 'reakit/Menu';
import { Category, Service } from 'server/entities';
import Button from 'src/components/button';
import Flex from 'src/components/flex';
import { ContextMenu, MenuItem } from 'src/components/menu';
import { BASE_STATE } from 'src/consts/entityBaseState';
import { categoryStore, localSrorageStore, uiStore } from 'src/stores';
import generateUuid from 'src/utils/generateUuid';
import styled from 'styled-components';
import { EntityTypes, ModalIdentity, ModalTypes } from 'typings';

const TopbarMenu: FC = () => {
  const { setUiStore, activeModals, activeTabId } = uiStore();
  const { data: categories } = categoryStore();
  const menu = useMenuState({
    animated: 120,
    modal: false,
  });

  const expandExistingModal = (index: number) =>
    setUiStore(d => {
      d.activeModals[index].state = 'expnanded';
    });

  const createNewServiceModal = (modalType: ModalTypes) => {
    const ctxCategory =
      categories?.find(c => c.id === activeTabId) || BASE_STATE.CATEGORY;

    const newModal: ModalIdentity<Service> = {
      id: generateUuid(),
      label: modalType,
      state: 'expnanded',
      title: 'Create New Service',
      entityType: 'Service',
      baseState: { ...BASE_STATE.SERVICE, category: ctxCategory },
      draft: { ...BASE_STATE.SERVICE, category: ctxCategory },
    };
    setUiStore(d => {
      d.activeModals.push(newModal);
    });
  };
  const createNewCategoryModal = (modalType: ModalTypes) => {
    const newModal: ModalIdentity<Category> = {
      id: generateUuid(),
      label: modalType,
      state: 'expnanded',
      title: 'Create New Category',
      entityType: 'Category',
      baseState: BASE_STATE.CATEGORY,
      draft: BASE_STATE.CATEGORY,
    };
    setUiStore(d => {
      d.activeModals.push(newModal);
    });
  };

  const createNewModal = (modalType: ModalTypes, entityType: EntityTypes) => {
    const ctxModalIndex = activeModals.findIndex(d => d.label === modalType);
    const ctxModalExists = ctxModalIndex !== -1;

    ctxModalExists
      ? expandExistingModal(ctxModalIndex)
      : entityType === 'Service'
      ? createNewServiceModal(modalType)
      : entityType === 'Category'
      ? createNewCategoryModal(modalType)
      : false;
  };

  return (
    <>
      <MenuButton {...menu}>
        {props => (
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
          {...menu}
          onClick={() => createNewModal(ModalTypes['new-service'], 'Service')}
        >
          New Service
        </MenuItem>
        <MenuItem
          onClick={() => createNewModal(ModalTypes['new-category'], 'Category')}
          {...menu}
        >
          New Category
        </MenuItem>
        <MenuItem {...menu}>New Note</MenuItem>

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
    setLocalStorage(draft => {
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
        <MenuItem {...menu} as="checbox" onClick={() => setThemeFun('light')}>
          <Flex justify="space-between" auto>
            Light
            {activeThemeId === 'light' && (
              <RadixIcons.CheckIcon role="selected-icon" />
            )}
          </Flex>
        </MenuItem>
        <MenuItem {...menu} onClick={() => setThemeFun('dark')}>
          <Flex justify="space-between" auto>
            Dark
            {activeThemeId === 'dark' && (
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
    content: '';
    height: 1px;
    position: absolute;
    top: 6px;
    left: 12px;
    width: calc(100% - 24px);
    background: ${p => p.theme.border.primary};
  }
`;

export default TopbarMenu;
