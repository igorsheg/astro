import * as RadixIcons from '@radix-ui/react-icons';
import React, { FC } from 'react';
import { MenuButton, useMenuState } from 'reakit/Menu';
import { RadixIconTypes } from 'shared/types/radixIconsTypes';
import Button from 'src/components/button';
import { ContextMenu, MenuItem } from 'src/components/menu';
import styled from 'styled-components';

interface NavBarMenuActions {
  action: string;
  label: string;
  icon: RadixIconTypes;
}
const ACTIONS: NavBarMenuActions[] = [
  { action: 'edit', label: 'Edit', icon: 'CopyIcon' },
  { action: 'duplicate', label: 'Duplicate', icon: 'CopyIcon' },
  { action: 'delete', label: 'Delete', icon: 'Pencil1Icon' },
];

const ManageMenu: FC = () => {
  const menu = useMenuState({
    modal: false,
    placement: 'bottom-end',
    animated: 420,
  });

  return (
    <Wrapper>
      <MenuButton {...menu}>
        {props => (
          <Button
            hierarchy="secondary"
            aria-label="View Service Menu"
            {...props}
          >
            <RadixIcons.DotsHorizontalIcon />
          </Button>
        )}
      </MenuButton>
      <ContextMenu {...menu} aria-label="Choose icon">
        {ACTIONS.map(action => (
          <MenuItem {...menu} key={action.action}>
            {action.label}
          </MenuItem>
        ))}
      </ContextMenu>
    </Wrapper>
  );
};

const Wrapper = styled('div')`
  display: inline-block;
  position: relative;
`;

export default ManageMenu;
