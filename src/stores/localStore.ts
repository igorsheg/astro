import produce from 'immer';
import { Theme } from 'server/entities';
import { SAMPLE_THEMES } from '../../server/config/seed-data';

import create from 'zustand';
import { persist } from 'zustand/middleware';

type UiStoreProps = {
  activeTheme: Theme['id'];
  setUi: (fn: (draft: UiStoreProps) => void) => void;
};

const localSrorage = create<UiStoreProps>(
  persist(
    set => ({
      activeTheme: 'dark',
      setUi: fn => {
        return set(produce(fn));
      },
    }),
    {
      name: 'astro-storage',
      getStorage: () => localStorage,
    },
  ),
);

export default localSrorage;
