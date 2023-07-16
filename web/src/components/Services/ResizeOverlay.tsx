import { FC } from "react";
import { ResizingService } from "./types";
import * as styles from "./Services.css";

interface ResizeOverlayProps {
    resizingService: ResizingService | null;
    serviceId: string;
}
export const ResizeOverlay: FC<ResizeOverlayProps> = ({
    resizingService,
    serviceId,
}) => {
    return (
        resizingService?.id === serviceId && (
            <div
                className={`${styles.resizeOverlay}`} // Add your SingleService styles here
                style={{
                    opacity: resizingService?.id ? 1 : 0,
                    width: `${resizingService.w}px`,
                    height: `${resizingService.h}px`,
                }}
            />
        )
    );
};
