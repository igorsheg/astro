import produce from 'immer';
import * as Entities from 'server/entities';
import { ModalIdentity } from 'typings';
import create, { State } from 'zustand';

interface SessionStorageProps extends State {
  activeTab: Entities.Category['id'];
  activeSidebarMenuItem: Lowercase<keyof typeof Entities>;
  searchTerm: string;
  inEditMode: boolean;
  setUiStore: (fn: (draft: SessionStorageProps) => void) => void;
  activeModals: ModalIdentity<any>[];
}

const uiStore = create<SessionStorageProps>(set => ({
  activeTab: 0,
  activeSidebarMenuItem: 'service',
  searchTerm: '',
  inEditMode: false,
  activeModals: [],
  setUiStore: fn => {
    return set(produce(fn));
  },
}));

export default uiStore;
