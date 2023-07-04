import { Theme } from "../types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiStoreProps {
  activeThemeId: Theme["id"];
  setLocalStorage: (theme: string) => void;
}

const localSrorageStore = create<UiStoreProps>()(
  persist(
    (set) => ({
      activeThemeId: "dark",
      setLocalStorage: (theme) => set({ activeThemeId: theme }),
    }),
    {
      name: "astro-storage",
    }
  )
);

export default localSrorageStore;
