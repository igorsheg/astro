import { FC, PropsWithChildren } from "react";
import * as styles from "./BgContainer.css";
import { lightTheme, darkTheme } from "../../styles/index.css";

interface BgContainerProps {
  theme: typeof lightTheme | typeof darkTheme;
}

export const BgContainer: FC<PropsWithChildren<BgContainerProps>> = ({
  theme,
  children,
}) => {
  return (
    <div className={styles.backgroundContainer}>
      <div
        className={`${styles.background} ${
          theme === lightTheme ? styles.visible : ""
        }`}
        style={{ backgroundImage: "url(/bg-light.jpg)" }}
      ></div>
      <div
        className={`${styles.background} ${
          theme === darkTheme ? styles.visible : ""
        }`}
        style={{ backgroundImage: "url(/bg-dark.png)" }}
      ></div>

      {children}
    </div>
  );
};
