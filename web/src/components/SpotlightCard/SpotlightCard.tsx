import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  cardStyles,
  borderHighlight,
  contentContainer,
  spotlight,
} from "./SpotlightCard.css";

export const SpotlightCard: React.FC<
  React.PropsWithChildren<{ isDragging: boolean }>
> = ({ children, isDragging }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const xPosition = useMotionValue(0);
  const yPosition = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const rotateX = useSpring(useTransform(yPosition, [-150, 150], [-3, 3]), {
    stiffness: 200,
    damping: 25,
  });

  const rotateY = useSpring(useTransform(xPosition, [-150, 150], [6, -6]), {
    stiffness: 200,
    damping: 25,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || isDragging) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const xPos = e.clientX - (rect.left + rect.width / 2);
      const yPos = e.clientY - (rect.top + rect.height / 2);

      xPosition.set(xPos);
      yPosition.set(yPos);
      spotlightX.set(e.clientX - rect.left - 150);
      spotlightY.set(e.clientY - rect.top - 150);
    };

    const handleMouseLeave = () => {
      // xPosition.set(0);
      // yPosition.set(0);
      // spotlightX.set(0);
      // spotlightY.set(0);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isDragging]);

  return (
    <motion.div
      ref={cardRef}
      className={cardStyles}
      style={{
        rotateX,
        rotateY,
        transformOrigin: "center",
        perspective: 1000,
      }}
    >
      <motion.div
        className={borderHighlight}
        style={{
          x: spotlightX,
          y: spotlightY,
        }}
      />
      <div className={contentContainer}>{children}</div>
      <motion.div
        className={spotlight}
        style={{
          x: spotlightX,
          y: spotlightY,
        }}
      />
    </motion.div>
  );
};
