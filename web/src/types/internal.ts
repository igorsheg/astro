import { ReactNode, ReactText } from "react";
import * as Entities from "./entities";
import { RadixIconTypes } from "./radixIconsTypes";
import { Toast } from "react-hot-toast";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Entities.Theme {}
}

export type EntityTypes = "services" | "categories" | "configs" | "themes";

export type FetcherRequestKeys = [enity: EntityTypes, id?: string | number];

export interface SideBarMenuItem {
  label: string;
  id: Lowercase<EntityTypes>;
  icon: RadixIconTypes;
}
export interface SelectOption {
  id: string | number;
  value: string;
  icon?: RadixIconTypes;
}
export type TargetType = "_blank" | "";


// Modals

export enum ModalTypes {
  "new-service" = "new-service",
  "new-category" = "new-category",
  "new-delete" = "new-delete",
  "edit-service" = "edit-service",
  "edit-category" = "edit-category",
  "service-monitor" = "service-monitor",
}
export type ModalStates = "expnanded" | "tucked" | "closed";

export interface ModalProps<T> {
  id: string;
  label: ModalTypes;
  title: ReactText | ReactNode;
  body?: string | ReactNode;
  state: ModalStates;
  entityType: EntityTypes;
  baseState?: T;
  draft?: T;
  collapsable?: boolean;
  closeNotification?: Pick<Toast, "message" | "type">;
  onRequestClose: (modal: ModalProps<T>) => void;
  lastInteraction?: number;
}

// export interface ModalIdentity<T> {
//   id: string | number;
//   label: ModalTypes;
//   title: string;
//   state: ModalStates;
//   entityType: EntityTypes;
//   baseState?: T;
//   draft?: T;
//   body?: string | ReactNode;
//   closeNotification?: Pick<Toast, "message" | "type">;
// }

