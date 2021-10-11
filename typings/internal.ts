import { ReactNode } from 'react';
import * as Entities from '../server/entities';
import { RadixIconTypes } from './radixIconsTypes';
import { Toast } from 'react-hot-toast';
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Entities.Theme {}
}

export type EntityTypes = keyof typeof Entities;

export type FetcherRequestKeys = [enity: EntityTypes, id?: string | number];

export interface SideBarMenuItem {
  label: string;
  id: Lowercase<EntityTypes>;
  icon: RadixIconTypes;
}

export enum ModalTypes {
  'new-service' = 'new-service',
  'new-category' = 'new-category',
  'new-delete' = 'new-delete',
  'edit-service' = 'edit-service',
}
export type ModalState = 'expnanded' | 'tucked' | 'closed';

export interface ModalIdentity<T> {
  id: string | number;
  label: ModalTypes;
  title?: string;
  state: ModalState;
  entityType: EntityTypes;
  baseState?: T;
  draft?: T;
  body?: string | ReactNode;
  closeNotification?: Pick<Toast, 'message' | 'type'>;
}

export interface SelectOption {
  id: string | number;
  value: string;
  icon?: RadixIconTypes;
}
export type TargetType = '_blank' | '';
