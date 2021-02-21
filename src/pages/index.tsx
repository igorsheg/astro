import React, { FC, useEffect } from 'react';
import { SAMPLE_CONFIG, SAMPLE_THEMES } from 'server/config/seed-data';
import { Config } from 'server/entities';
import fetcher from 'shared/utils/fetcher';
import { localSrorageStore } from 'src/stores';
import { configStore } from 'src/stores';

const Index: FC = () => {
  const { activeTheme, setUi } = localSrorageStore();
  const { data: configData, mutate: mutateConfig } = configStore();

  const changeThemeHandler = () => {
    setUi(d => {
      d.activeTheme =
        activeTheme === 'light'
          ? SAMPLE_THEMES.dark.id
          : SAMPLE_THEMES.light.id;
    });
  };

  const changeTitleHandler = () => {
    if (configData) {
      const rand = `${Math.random()}`;
      mutateConfig(d => {
        if (d.data) {
          d.data.title = rand;
        }
      });
      fetcher<Config>(['Config', SAMPLE_CONFIG.id], { data: { title: rand } });
    }
  };

  return (
    <main>
      <div>{configData?.title}</div>
      <button onClick={changeThemeHandler}>Change Theme!</button>
      <button onClick={changeTitleHandler}>Change Title!</button>
    </main>
  );
};

export default Index;
