import { produce } from "immer";
import { ALL_SERVICES_TAB } from "../consts/entityBaseState";
import { create } from "zustand";
import { ModalProps } from "../types";

interface SessionStorageProps {
  activeTabId: string;
  searchTerm: string;
  inEditMode: boolean;
  setUiStore: (fn: (draft: SessionStorageProps) => void) => void;
  activeModals: Omit<ModalProps<any>, "onRequestClose">[];
}

const uiStore = create<SessionStorageProps>((set) => ({
  activeTabId: ALL_SERVICES_TAB.id as string,
  searchTerm: "",
  inEditMode: false,
  activeModals: [],
  setUiStore: (fn: any) => {
    return set(produce(fn));
  },
}));

export type { SessionStorageProps };
export default uiStore;
