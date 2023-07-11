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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig: SpringOptions = {
    stiffness: 600,
    damping: 30,
  };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(
    springY,
    [-window.innerHeight / 2, window.innerHeight / 2],
    [0, 0],
  );
  const rotateY = useTransform(
    springX,
    [-window.innerWidth / 2, window.innerWidth / 2],
    [0, 0],
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPosition = event.clientX - rect.left - rect.width / 2;
    const yPosition = event.clientY - rect.top - rect.height / 2;

    const mouseXPosition = event.clientX - rect.left;
    const mouseYPosition = event.clientY - rect.top;

    x.set(xPosition);
    y.set(yPosition);
    mouseX.set(mouseXPosition);
    mouseY.set(mouseYPosition);
  };

  const [coords, setCoords] = useState({ x: "0px", y: "0px" });

  useEffect(() => {
    const container = ref.current;
    let rafId: number | null = null;
    let nextCoords = { x: "0px", y: "0px" };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      nextCoords = {
        x: `${e.clientX - container!.offsetLeft}px`,
        y: `${e.clientY - container!.offsetTop}px`,
      };

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

  return (
    <motion.div
      ref={ref}
      className={cardStyles}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        mouseX.set(0);
        mouseY.set(0);
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
