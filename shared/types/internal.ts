import * as Entities from '../../server/entities';
import { RadixIconTypes } from './radixIconsTypes';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Entities.Theme {}
}

export type FetcherRequestKeys = [enity: keyof typeof Entities, id?: string];

export interface SideBarMenuItem {
  label: string;
  id: keyof typeof Entities;
  icon: RadixIconTypes;
}
