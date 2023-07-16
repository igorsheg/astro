import React, { useRef, useEffect, PropsWithChildren } from "react";
import { useSpring, animated } from "react-spring";
import {
  cardStyles,
  borderHighlight,
  contentContainer,
  spotlight,
} from "./SpotlightBorder.css";

const FancyCard: React.FC<PropsWithChildren> = ({ children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [{ rotateX, rotateY, spotlightX, spotlightY }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    spotlightX: 150,
    spotlightY: 150,
    config: {
      tension: 300,
      friction: 26,
    },
  }));

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const xPosition = e.clientX - rect.left;
    const yPosition = e.clientY - rect.top;

    const normalizedX = ((xPosition - rect.width / 2) / (rect.width / 2)) * 150;
    const normalizedY =
      ((yPosition - rect.height / 2) / (rect.height / 2)) * 150;

    // Subtract half the size of the spotlight (150px)
    const spotlightX = xPosition - 150;
    const spotlightY = yPosition - 150;

    api.start({
      rotateX: -normalizedY / 30,
      rotateY: normalizedX / 30,
      spotlightX,
      spotlightY,
    });
  };

  const handleMouseLeave = () => {
    // api.start({ rotateX: 0, rotateY: 0, spotlightX: 0, spotlightY: 0 });
  };

  useEffect(() => {
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
  }, []);

  const AnimatedDiv = animated.div;

  return (
    <AnimatedDiv
      ref={cardRef}
      className={cardStyles}
      style={{
        rotateX,
        rotateY,
        transformOrigin: "center",
      }}
    >
      <AnimatedDiv
        className={borderHighlight}
        style={{
          x: spotlightX,
          y: spotlightY,
        }}
      />
      <div className={contentContainer}>{children}</div>
      <AnimatedDiv
        className={spotlight}
        style={{
          x: spotlightX,
          y: spotlightY,
        }}
      />
    </AnimatedDiv>
  );
};

export default FancyCard;
