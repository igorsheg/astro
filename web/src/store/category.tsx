import { Instance, flow, types } from "mobx-state-tree";

export type CategoryType = Instance<typeof Category>;

export const Category = types.model("Category", {
  id: types.identifier,
  name: types.string,
  description: types.string,
  icon: types.string,
});

export const CategoriesStore = types
  .model({
    categories: types.array(Category),
  })
  .actions((self) => ({
    fetchCategories: flow(function* fetchCategories(baseUrl) {
      try {
        const response = yield fetch(`${baseUrl}/categories`);
        const categories: CategoryType[] = yield response.json();
        self.categories.replace(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }),
  }));
