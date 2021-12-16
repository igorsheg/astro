import React, { FC } from 'react';
import TopbarMenu from '../../menus/topbar-menu';
import {  uiStore } from '../../stores';
import { Config } from '../../types';
import Button from '../button';
import Flex from '../flex';
import Padder from '../padder';

const Actions: FC<{config: Config}> = () => {
  const { setUiStore, inEditMode } = uiStore();

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
