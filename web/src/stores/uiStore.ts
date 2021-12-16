import produce from "immer";
import { ALL_SERVICES_TAB } from "../consts/entityBaseState";
import create, { State } from "zustand";
import { ModalProps } from "../types";

interface SessionStorageProps<T> extends State {
  activeTabId: string;
  searchTerm: string;
  inEditMode: boolean;
  setUiStore: (fn: (draft: SessionStorageProps<T>) => void) => void;
  activeModals: Omit<ModalProps<any>, "onRequestClose">[];
}

const uiStore = create<SessionStorageProps<any>>((set) => ({
  activeTabId: ALL_SERVICES_TAB.id as string,
  searchTerm: "",
  inEditMode: false,
  activeModals: [],
  setUiStore: (fn: any) => {
    return set(produce(fn));
  },
}));

export { SessionStorageProps };
export default uiStore;
