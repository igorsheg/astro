import produce from 'immer';
import { Category, Theme } from 'server/entities';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { SAMPLE_CATEGORIES } from '../../server/config/seed-data';

type UiStoreProps = {
  activeTheme: Theme['id'];
  setUi: (fn: (draft: UiStoreProps) => void) => void;
  activeTab: Category;
  searchTerm: string;
};

const localSrorage = create<UiStoreProps>(
  persist(
    set => ({
      activeTheme: 'dark',
      activeTab: SAMPLE_CATEGORIES[0],
      searchTerm: '',
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
