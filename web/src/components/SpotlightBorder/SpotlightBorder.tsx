import { useRef, PropsWithChildren, useState, useEffect } from "react";
import {
  cardStyles,
  borderHighlight,
  contentContainer,
  spotlight,
} from "./SpotlightBorder.css";
import {
  SpringOptions,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const FancyCard: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig: SpringOptions = {
    stiffness: 300,
    damping: 30,
  };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(
    springY,
    [-window.innerHeight / 2, window.innerHeight / 2],
    [-10, 10],
  );
  const rotateY = useTransform(
    springX,
    [-window.innerWidth / 2, window.innerWidth / 2],
    [10, -10],
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // offsetX and offsetY give the position of the mouse relative to the element
    const xPosition = event.nativeEvent.offsetX - rect.width / 2;
    const yPosition = event.nativeEvent.offsetY - rect.height / 2;

    x.set(xPosition);
    y.set(yPosition);
  };

  const [coords, setCoords] = useState({ x: "0px", y: "0px" });

  useEffect(() => {
    const container = ref.current;
    let rafId: number | null = null;
    let nextCoords = { x: "0px", y: "0px" };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = container?.getBoundingClientRect();

      if (rect) {
        nextCoords = {
          x: `${e.clientX - rect.left - 150}px`, // subtracting half the size of the spotlight
          y: `${e.clientY - rect.top + window.screenTop - 150}px`,
        };
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setCoords(nextCoords);
          rafId = null;
        });
      }
    };

    if (container) {
      container.addEventListener("mousemove", handleMouseMove as any);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove as any);
      }

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const spotlightElement = container.querySelector(`.${spotlight}`);
      const borderHighlightElement = container.querySelector(
        `.${borderHighlight}`,
      );
      if (spotlightElement && borderHighlightElement) {
        console.log(
          "spotlightElement dimensions",
          spotlightElement.getBoundingClientRect(),
        );
        console.log(
          "borderHighlightElement dimensions",
          borderHighlightElement.getBoundingClientRect(),
        );
      }
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cardStyles}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformOrigin: "center",
      }}
    >
      <div
        className={borderHighlight}
        style={{
          transform: `translate(${coords.x}, ${coords.y})`,
        }}
      />
      <div className={contentContainer}>{children}</div>
      <div
        className={spotlight}
        style={{
          transform: `translate(${coords.x}, ${coords.y})`,
        }}
      />
    </motion.div>
  );
};

export default FancyCard;
