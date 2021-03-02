import { useRouter } from 'next/router';
import React, { FC } from 'react';
import TopbarMenu from 'src/menus/topbar-menu';
import { configStore, uiStore } from 'src/stores';
import styled from 'styled-components';
import Button from '../button';
import Flex from '../flex';
import Padder from '../padder';

const Actions: FC = () => {
  const { data: config } = configStore();
  const { activeSidebarMenuItem } = uiStore();

  const router = useRouter();

  if (!config) {
    return null;
  }

  return (
    <Flex style={{ zIndex: 999999991 }}>
      {/* <Devider /> */}
      <Button
        tabIndex={0}
        onClick={() =>
          router.push(`/manage/${activeSidebarMenuItem || 'service'}`)
        }
      >
        Manage
      </Button>
      <Padder x={12} />
      <TopbarMenu />
    </Flex>
  );
};

const Devider = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  width: 24px;
  height: 30px;

  :after {
    content: '';
    position: absolute;
    right: 12px;
    height: 60%;
    width: 1px;
    background: ${p => p.theme.border.primary};
  }
`;

export default Actions;
