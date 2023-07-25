import { FC, SVGProps } from "react";
import * as styles from "./Services.css";

interface ResizeHandleProps {
  onMouseDown: (event: React.MouseEvent) => void;
}

export const ResizeHandle: FC<ResizeHandleProps> = ({ onMouseDown }) => {
  return (
    <div className={styles.resizeHandle} onMouseDown={onMouseDown}>
      <MdiResizeBottomRight />
    </div>
  );
};

const MdiResizeBottomRight = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22 22h-2v-2h2v2m0-4h-2v-2h2v2m-4 4h-2v-2h2v2m0-4h-2v-2h2v2m-4 4h-2v-2h2v2m8-8h-2v-2h2v2Z"
      ></path>
    </svg>
  );
};
