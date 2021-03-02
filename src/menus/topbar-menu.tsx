import * as RadixIcons from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';
import React, { FC, forwardRef, useState } from 'react';
import { MenuButton, MenuSeparator, useMenuState } from 'reakit/Menu';
import Button from 'src/components/button';
import Flex from 'src/components/flex';
import { ContextMenu, MenuItem } from 'src/components/menu';
import { localSrorageStore } from 'src/stores';
import styled from 'styled-components';

const NewServiceModal = dynamic(() => import('src/modals/new-service'), {
  ssr: false,
});

const TopbarMenu: FC = () => {
  const menu = useMenuState({
    animated: 120,
    modal: false,
  });
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);

  return (
    <>
      <NewServiceModal
        onRequestClose={() => setIsNewServiceModalOpen(false)}
        isOpen={isNewServiceModalOpen}
        title="Create New Service"
      />
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
        <MenuItem {...menu} onClick={() => setIsNewServiceModalOpen(true)}>
          New Service
        </MenuItem>
        <MenuItem {...menu}>New Category</MenuItem>
        <MenuItem {...menu}>New Note</MenuItem>

        <Seperator />

        <MenuItem closeOnClick={false} {...menu} as={ApperanceMenu} />
      </ContextMenu>
    </>
  );
};

const ApperanceMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const menu = useMenuState();
  const { setLocalStorage, activeTheme } = localSrorageStore();

  const setThemeFun = (theme: string) => {
    setLocalStorage(draft => {
      draft.activeTheme = theme;
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
            {activeTheme === 'light' && <RadixIcons.CheckIcon />}
          </Flex>
        </MenuItem>
        <MenuItem {...menu} onClick={() => setThemeFun('dark')}>
          <Flex justify="space-between" auto>
            Dark
            {activeTheme === 'dark' && <RadixIcons.CheckIcon />}
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
  /* display: inline-block; */
  /* position: relative; */
`;

export default TopbarMenu;
