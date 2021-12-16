import produce from "immer";
import { Theme } from "../types";
import create, { SetState, GetState } from "zustand";
import { persist, StoreApiWithPersist } from "zustand/middleware";

interface UiStoreProps {
  activeThemeId: Theme["id"];
  setLocalStorage: (fn: (draft: UiStoreProps) => void) => void;
}

const localSrorageStore = create(
  persist<
    UiStoreProps,
    SetState<UiStoreProps>,
    GetState<UiStoreProps>,
    StoreApiWithPersist<UiStoreProps>
  >(
    (set) => ({
      activeThemeId: "dark",
      setLocalStorage: (fn) => {
        return set(produce(fn));
      },
    }),
    {
      name: "astro-storage",
      getStorage: () => localStorage,
    }
  )
);

export default localSrorageStore;
