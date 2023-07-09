import { types } from "mobx-state-tree";

export const UiStore = types
  .model({
    activeTab: types.optional(types.string, "all"),
  })
  .actions((self) => ({
    setActiveTab(tabId: string) {
      self.activeTab = tabId;
    },
  }));
