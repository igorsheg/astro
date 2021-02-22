import * as Entities from '../../server/entities';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Entities.Theme {}
}

export type FetcherRequestKeys = [enity: keyof typeof Entities, id?: string];
