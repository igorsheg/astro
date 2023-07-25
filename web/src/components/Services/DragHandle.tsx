import { FC } from "react";
import * as styles from "./Services.css";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type ResizeHandleProps = SyntheticListenerMap | undefined;

export const DragHandle: FC<ResizeHandleProps> = ({ ...listeners }) => {
  return (
    <div className={styles.dragHandle} {...listeners}>
      <DragHandleIcon />
    </div>
  );
};

const DragHandleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-grip-horizontal"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M5 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M5 15m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M12 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M12 15m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M19 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M19 15m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
  </svg>
);
