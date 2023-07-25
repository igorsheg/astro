import { useCallback, useEffect, useRef, useState } from "react";

interface Service {
  id: string;
  grid_w: number;
  grid_h: number;
  [key: string]: any;
}

interface GridDimensions {
  gridColumnEnd: number;
  gridRowEnd: number;
}

interface OverlayDimensions {
  width: number;
  height: number;
}

const useResizeGrid = (service: Service, threshold: number = 150) => {
  const gridItemRef = useRef<HTMLDivElement>(null);
  const initialWidthRef = useRef<number>(0);
  const initialHeightRef = useRef<number>(0);
  const lastSnapWidthRef = useRef<number>(0);
  const lastSnapHeightRef = useRef<number>(0);
  const lastSnapXRef = useRef<number>(0);
  const lastSnapYRef = useRef<number>(0);

  const [gridDimensions, setGridDimensions] = useState<GridDimensions>({
    gridColumnEnd: service.grid_w,
    gridRowEnd: service.grid_h,
  });
  const [overlayDimensions, setOverlayDimensions] = useState<OverlayDimensions>(
    { width: 0, height: 0 },
  );

  useEffect(() => {
    if (gridItemRef.current) {
      const { offsetWidth, offsetHeight } = gridItemRef.current;
      initialWidthRef.current = offsetWidth;
      initialHeightRef.current = offsetHeight;
      lastSnapWidthRef.current = offsetWidth;
      lastSnapHeightRef.current = offsetHeight;
      setOverlayDimensions({
        width: offsetWidth,
        height: offsetHeight,
      });
    }
  }, [gridItemRef.current]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const initialX = event.clientX;
      const initialY = event.clientY;
      lastSnapXRef.current = initialX;
      lastSnapYRef.current = initialY;

      const onMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - initialX;
        const dy = event.clientY - initialY;

        // Calculate new overlay dimensions based on mouse movement
        const newOverlayWidth = initialWidthRef.current + dx;
        const newOverlayHeight = initialHeightRef.current + dy;

        setOverlayDimensions({
          width: newOverlayWidth,
          height: newOverlayHeight,
        });

        const dxFromLastSnap = event.clientX - lastSnapXRef.current;
        const dyFromLastSnap = event.clientY - lastSnapYRef.current;

        if (
          Math.abs(dxFromLastSnap) >= threshold ||
          Math.abs(dyFromLastSnap) >= threshold
        ) {
          // Calculate new grid dimensions
          const newGridColumnEnd = Math.max(
            1,
            Math.round(
              newOverlayWidth / (initialWidthRef.current / service.grid_w),
            ),
          );
          const newGridRowEnd = Math.max(
            1,
            Math.round(
              newOverlayHeight / (initialHeightRef.current / service.grid_h),
            ),
          );

          setGridDimensions({
            gridColumnEnd: newGridColumnEnd,
            gridRowEnd: newGridRowEnd,
          });

          // Update last snap position and dimensions
          lastSnapXRef.current = event.clientX;
          lastSnapYRef.current = event.clientY;
          lastSnapWidthRef.current = newOverlayWidth;
          lastSnapHeightRef.current = newOverlayHeight;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", onMouseMove);
        },
        { once: true },
      );
    },
    [service, threshold],
  );

  return {
    gridDimensions,
    overlayDimensions,
    gridItemRef,
    handleMouseDown,
  };
};

export default useResizeGrid;
