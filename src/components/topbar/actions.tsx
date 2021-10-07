import React, { FC } from 'react';
import TopbarMenu from 'src/menus/topbar-menu';
import { configStore, uiStore } from 'src/stores';
import Button from '../button';
import Flex from '../flex';
import Padder from '../padder';

const Actions: FC = () => {
  const { data: config } = configStore();
  const { setUiStore, inEditMode } = uiStore();
  if (!config) {
    return null;
  }

  return (
    <Flex style={{ zIndex: 999999991 }}>
      <Button
        tabIndex={0}
        onClick={() =>
          setUiStore(d => {
            d.inEditMode = !d.inEditMode;
          })
        }
      >
        {inEditMode ? "I'm Done" : 'Manage'}
      </Button>
      <Padder x={12} />
      <TopbarMenu />
    </Flex>
  );
};

export default Actions;
