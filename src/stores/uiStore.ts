import produce from 'immer';
import * as Entities from 'server/entities';
import { ALL_SERVICES_TAB } from 'src/consts/entityBaseState';
import { ModalIdentity } from 'typings';
import create, { State } from 'zustand';

interface SessionStorageProps extends State {
  activeTabId: string;
  activeSidebarMenuItem: Lowercase<keyof typeof Entities>;
  searchTerm: string;
  inEditMode: boolean;
  setUiStore: (fn: (draft: SessionStorageProps) => void) => void;
  activeModals: ModalIdentity<any>[];
}

const uiStore = create<SessionStorageProps>(set => ({
  activeTabId: ALL_SERVICES_TAB.id as string,
  activeSidebarMenuItem: 'service',
  searchTerm: '',
  inEditMode: false,
  activeModals: [],
  setUiStore: fn => {
    return set(produce(fn));
  },
}));

export default uiStore;
