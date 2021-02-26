import produce from 'immer';
import { Theme } from 'server/entities';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type UiStoreProps = {
  activeTheme: Theme['id'];
  setLocalStorage: (fn: (draft: UiStoreProps) => void) => void;
};

const localSrorageStore = create<UiStoreProps>(
  persist(
    set => ({
      activeTheme: 'dark',
      setLocalStorage: fn => {
        return set(produce(fn));
      },
    }),
    {
      name: 'astro-storage',
      getStorage: () => localStorage,
    },
  ),
);

export default localSrorageStore;
