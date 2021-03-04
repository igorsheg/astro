import produce from 'immer';
import { SAMPLE_CATEGORIES } from 'server/config/seed-data';
import * as Entities from 'server/entities';
import { ModalIdentity } from 'shared/types/internal';
import create, { State } from 'zustand';

interface SessionStorageProps extends State {
  activeTab: Entities.Category['id'];
  activeSidebarMenuItem: Lowercase<keyof typeof Entities>;
  searchTerm: string;
  setUiStore: (fn: (draft: SessionStorageProps) => void) => void;
  activeModals: ModalIdentity<any>[];
}

const uiStore = create<SessionStorageProps>(set => ({
  activeTab: SAMPLE_CATEGORIES[0].id,
  activeSidebarMenuItem: 'service',
  searchTerm: '',
  activeModals: [],
  setUiStore: fn => {
    return set(produce(fn));
  },
}));

export default uiStore;
