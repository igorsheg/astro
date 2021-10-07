import { ReactNode } from 'react';
import * as Entities from '../server/entities';
import { RadixIconTypes } from './radixIconsTypes';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Entities.Theme {}
}

export type FetcherRequestKeys = [
  enity: keyof typeof Entities,
  id?: string | number,
];

export interface SideBarMenuItem {
  label: string;
  id: Lowercase<keyof typeof Entities>;
  icon: RadixIconTypes;
}

export enum ModalTypes {
  'new-service' = 'new-service',
  'new-category' = 'new-category',
  'new-delete' = 'new-delete',
}
export type ModalState = 'expnanded' | 'tucked' | 'closed';

export interface ModalIdentity<T> {
  id: string;
  label: ModalTypes;
  title?: string;
  state: ModalState;
  data?: T;
  body: string | ReactNode;
}

export interface SelectOption {
  id: string | number;
  value: string;
  icon?: RadixIconTypes;
}
