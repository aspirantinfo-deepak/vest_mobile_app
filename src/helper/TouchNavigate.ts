import { useRef } from "react";

export const useTouchNavigate = (config?: any) => {
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const swipeThreshold = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const onTouchEnd = () => {
        const unsetTouchNavigator = localStorage.getItem("unsetTouchNavigator");
        if (!unsetTouchNavigator && touchStartX.current !== null && touchEndX.current !== null) {
            const distance = touchEndX.current - touchStartX.current;
            if (Math.abs(distance) > swipeThreshold) {
                if (distance > 0) {
                    config?.right && config?.right?.()
                } else {
                    config?.left && config.left?.()
                }
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return { onTouchStart, onTouchMove, onTouchEnd }
}
