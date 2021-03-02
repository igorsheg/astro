import { useRouter } from 'next/router';
import React, { FC, ReactElement, useMemo } from 'react';
import * as Entities from 'server/entities';
import { SideBarMenuItem } from 'shared/types/internal';
import Flex from 'src/components/flex';
import Padder from 'src/components/padder';
import { Sidebar } from 'src/components/sidebar';
import ManageServiceList from 'src/scences/manage/service';
import { configStore, localSrorageStore, uiStore } from 'src/stores';
import styled from 'styled-components';

const MENU_ITEMS: SideBarMenuItem[] = [
  { id: 'service', label: 'Services', icon: 'CubeIcon' },
  { id: 'category', label: 'Categories', icon: 'IdCardIcon' },
  { id: 'note', label: 'Notes', icon: 'ChatBubbleIcon' },
];

interface ManageScences {
  path: Lowercase<keyof typeof Entities>;
  component: ReactElement;
  label: string;
}

const SCENCES: ManageScences[] = [
  { path: 'service', label: 'Services', component: <ManageServiceList /> },
  { path: 'category', label: 'Categories', component: <ManageServiceList /> },
  { path: 'note', label: 'Notes', component: <ManageServiceList /> },
];

const Index: FC = () => {
  const { activeTheme } = localSrorageStore();
  const { data: config } = configStore();
  const { setUiStore } = uiStore();

  const router = useRouter();

  const ctxScene = useMemo(
    () => SCENCES.find(scene => scene.path === router.query.entity),
    [router.query.entity],
  );

  const onMenuItemClickHandler = (item: SideBarMenuItem) => {
    setUiStore(d => {
      d.activeSidebarMenuItem = item.id;
    });
    router.replace(`/manage/${item.id.toLowerCase()}`);
  };

  return (
    <Flex>
      <Sidebar
        menuItems={MENU_ITEMS}
        activeSidebarMenuItemId={router.query.entity as SideBarMenuItem['id']}
        config={config as Entities.Config}
        activeTheme={activeTheme}
        onMenuItemClick={onMenuItemClickHandler}
      />
      <Grid>
        <ManageHeader>
          <Padder y={54} />
          <h1>{ctxScene?.label}</h1>
          <Padder y={30} />
        </ManageHeader>
        {ctxScene && ctxScene.component ? ctxScene.component : null}
      </Grid>
    </Flex>
  );
};

const ManageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  max-width: 960px;
  position: relative;
  width: calc(100% - 96px);
  display: flex;
  /* height: 120px; */
  h1 {
    margin: 0;
    font-size: 28px;
  }
`;
const Grid = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

export default Index;
