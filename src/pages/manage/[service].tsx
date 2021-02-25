import React, { FC } from 'react';
import Flex from 'src/components/flex';
import Grid from 'src/components/grid';
import { Sidebar } from 'src/components/sidebar';
import { configStore, localSrorageStore } from 'src/stores';

const Index: FC = () => {
  const { activeTheme } = localSrorageStore();
  const { data: config } = configStore();

  if (!config) {
    return null;
  }

  return (
    <Flex>
      <Sidebar config={config} activeTheme={activeTheme} />
      <Grid></Grid>
    </Flex>
  );
};

export default Index;
