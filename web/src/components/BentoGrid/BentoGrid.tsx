import React, { ReactNode } from "react";
import * as styles from "./BentoGrid.css";

export type Priority = "high" | "medium" | "none";

interface BentoGridProps {
  children: ReactNode;
}

const BentoGrid: React.FC<BentoGridProps> & { Item: typeof BentoGridItem } = ({
  children,
}) => {
  return (
    <div className={styles.gridContainer}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ItemProps>(child)) {
          let priorityStyle;
          switch (child.props.priority) {
            case "high":
              priorityStyle = styles.gridItemHigh;
              break;
            case "medium":
              priorityStyle = styles.gridItemMedium;
              break;
            default:
              priorityStyle = null;
          }

          return React.cloneElement(child, {
            className: `${styles.gridItem} ${priorityStyle}`,
          });
        }

        return child;
      })}
    </div>
  );
};

interface ItemProps {
  children: ReactNode;
  priority?: Priority;
  className?: string;
}

const BentoGridItem: React.FC<ItemProps & { className?: string }> = ({
  children,
  className,
}) => {
  return <div className={className}>{children}</div>;
};

BentoGrid.Item = BentoGridItem;
export default BentoGrid;
