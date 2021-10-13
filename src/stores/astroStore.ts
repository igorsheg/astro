import produce from 'immer';
import { SAMPLE_CONFIG } from 'server/config/seed-data';
import { Category, Config, Service, Theme } from 'server/entities';
import { fetcher } from 'src/utils';
import { FetcherRequestKeys } from 'typings';
import create, { GetState, SetState, State } from 'zustand';

interface AstroStoreProps<T> extends State {
  data: T | null;
  mutate: (fn: (draft: AstroStoreProps<T>) => void) => void;
  sync: () => Promise<number | Error>;
}

interface ZustandStoreApi<T> {
  get: GetState<AstroStoreProps<T>>;
  set: SetState<AstroStoreProps<T>>;
}

const baseStore = <T>(key: FetcherRequestKeys, store: ZustandStoreApi<T>) => ({
  data: null,
  mutate: (fn: any) => store.set(produce(fn)),
  sync: async () => {
    try {
      const syncReq = await fetcher<T>(key);
      store.set({ data: syncReq.data });
      return syncReq.status;
    } catch (err) {
      return new Error(err as any);
    }
  },
});

const configStore = create<AstroStoreProps<Config>>((set, get) => ({
  ...baseStore(['Config', SAMPLE_CONFIG.id], { set, get }),
}));

const themeStore = create<AstroStoreProps<Theme[]>>((set, get) => ({
  ...baseStore(['Theme'], { set, get }),
}));

const serviceStore = create<AstroStoreProps<Service[]>>((set, get) => ({
  ...baseStore(['Service'], { set, get }),
}));

const categoryStore = create<AstroStoreProps<Category[]>>((set, get) => ({
  ...baseStore(['Category'], { set, get }),
}));

export { configStore, themeStore, serviceStore, categoryStore };
