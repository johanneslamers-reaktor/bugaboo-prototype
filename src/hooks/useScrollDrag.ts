import { useCallback, useRef, useState, type PointerEvent, type RefObject } from "react";

type DragGesture = {
  isHorizontal: boolean;
  startScrollLeft: number;
  startX: number;
  startY: number;
};

/**
 * Adds desktop mouse-drag-to-scroll on a native horizontal scroll container.
 * Touch is intentionally not intercepted — native scroll-snap on iOS/android
 * is smoother than anything JS can do.
 *
 * Usage:
 *   const scrollerRef = useRef<HTMLDivElement | null>(null);
 *   const drag = useScrollDrag(scrollerRef);
 *   <div ref={scrollerRef} {...drag.handlers} data-dragging={drag.isDragging}>
 */
export function useScrollDrag(scrollerRef: RefObject<HTMLElement | null>) {
  const gestureRef = useRef<DragGesture | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || event.pointerType !== "mouse" || event.button !== 0) return;
    if (isInteractiveElement(event.target)) return;

    gestureRef.current = {
      isHorizontal: false,
      startScrollLeft: scroller.scrollLeft,
      startX: event.clientX,
      startY: event.clientY,
    };
  }, [scrollerRef]);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const scroller = scrollerRef.current;
    const gesture = gestureRef.current;
    if (!scroller || !gesture) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.isHorizontal) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        gestureRef.current = null;
        return;
      }
      gesture.isHorizontal = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    scroller.scrollLeft = gesture.startScrollLeft - deltaX;
  }, [scrollerRef]);

  const finishGesture = useCallback((event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (!gesture?.isHorizontal) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishGesture,
      onPointerCancel: finishGesture,
    },
  };
}

function isInteractiveElement(target: EventTarget) {
  return target instanceof Element && target.closest("button, a, input, select, textarea") !== null;
}
