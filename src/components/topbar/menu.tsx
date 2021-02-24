import React, { FC } from 'react';
import { MenuButton, useMenuState } from 'reakit/Menu';
import { RadixIconTypes } from 'shared/types/radixIconsTypes';
import styled from 'styled-components';
import Button from '../button';
import { ContextMenu, MenuItem } from '../menu';
import * as RadixIcons from '@radix-ui/react-icons';

type Props = {
  onOpen?: () => void;
  onChange: (color: string, icon: string) => void;
};

interface NavBarMenuActions {
  action: string;
  label: string;
  icon: RadixIconTypes;
}
const ACTIONS: NavBarMenuActions[] = [
  { action: 'new-category', label: 'New Category', icon: 'CopyIcon' },
  { action: 'new-note', label: 'New Note', icon: 'CopyIcon' },
  { action: 'edit-services', label: 'Edit Services', icon: 'Pencil1Icon' },
];

const NavBarMenu: FC<Props> = ({ onOpen, onChange }) => {
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
            skin="default"
            hierarchy="secondary"
            aria-label="View Service Menu"
            {...props}
          >
            <RadixIcons.DotsHorizontalIcon />
          </Button>
        )}
      </MenuButton>
      <ContextMenu {...menu} onOpen={onOpen} aria-label="Choose icon">
        {ACTIONS.map(action => (
          <MenuItem key={action.action}>{action.label}</MenuItem>
        ))}
      </ContextMenu>
    </Wrapper>
  );
};

const Wrapper = styled('div')`
  display: inline-block;
  position: relative;
`;

export default NavBarMenu;
