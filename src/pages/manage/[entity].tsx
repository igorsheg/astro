import React, { FC } from 'react';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import { Sidebar } from 'src/components/sidebar';
import { configStore, localSrorageStore, uiStore } from 'src/stores';
import { useRouter } from 'next/router';
import { SideBarMenuItem } from 'shared/types/internal';

const MENU_ITEMS: SideBarMenuItem[] = [
  { id: 'service', label: 'Services', icon: 'CubeIcon' },
  { id: 'category', label: 'Categories', icon: 'IdCardIcon' },
  { id: 'note', label: 'Notes', icon: 'ChatBubbleIcon' },
];

const Index: FC = () => {
  const { activeTheme } = localSrorageStore();
  const { data: config } = configStore();
  const { setUiStore } = uiStore();

  if (!config) {
    return null;
  }
  const router = useRouter();

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
        config={config}
        activeTheme={activeTheme}
        onMenuItemClick={onMenuItemClickHandler}
      />
      <Grid></Grid>
    </Flex>
  );
};

export default Index;
