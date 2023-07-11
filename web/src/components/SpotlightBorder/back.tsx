import { useState, useEffect, useRef } from "react";
import {
  cardStyles,
  borderHighlight,
  contentContainer,
  spotlight,
} from "./SpotlightBorder.css";

interface FancyCardProps {
  children: React.ReactNode;
}

export const FancyCard: React.FC<FancyCardProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: "0px", y: "0px" });

  useEffect(() => {
    const container = containerRef.current;
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
    <div
      ref={containerRef}
      className={cardStyles}
      style={
        { "--mouse-x": coords.x, "--mouse-y": coords.y } as React.CSSProperties
      }
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
    </div>
  );
};
