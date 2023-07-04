import { Instance, flow, types } from "mobx-state-tree";
import { createContext } from "react";
import { ServicesStore } from "./service";
import { CategoriesStore } from "./category";
import { UiStore } from "./ui";

export type RootStoreType = Instance<typeof RootStore>;

export const RootStore = types
  .model({
    baseUrl: types.string,
    servicesStore: ServicesStore,
    categoriesStore: CategoriesStore,
    uiState: UiStore,
  })
  .actions((self) => ({
    fetchData: flow(function* fetchData() {
      yield self.categoriesStore.fetchCategories(self.baseUrl);
      yield self.servicesStore.fetchServices(self.baseUrl);
    }),
  }));

const rootStore = RootStore.create({
  baseUrl: "http://localhost:5432/api/v1",
  servicesStore: {},
  categoriesStore: {},
  uiState: { activeTab: "all" },
});

export const StoreContext = createContext(rootStore);
