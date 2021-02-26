import produce from 'immer';
import { SAMPLE_CONFIG } from 'server/config/seed-data';
import { Config, Service, Theme } from 'server/entities';
import fetcher from 'shared/utils/fetcher';
import { FetcherRequestKeys } from 'shared/types/internal';
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  mutate: fn => store.set(produce(fn)),
  sync: async () => {
    try {
      const syncReq = await fetcher<T>(key);
      store.set({ data: syncReq.data });
      return syncReq.status;
    } catch (err) {
      return new Error(err);
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

export { configStore, themeStore, serviceStore };
