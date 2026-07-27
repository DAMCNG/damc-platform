"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export function AutoScrollRow({
  children,
  pxPerSecond = 28,
  gapClassName = "gap-5",
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  pxPerSecond?: number;
  gapClassName?: string;
  ariaLabel: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const resumeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const drag = React.useRef<{ active: boolean; startX: number; startScrollLeft: number; movedPastThreshold: boolean; captured: boolean }>({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    movedPastThreshold: false,
    captured: false,
  });

  const [overflowing, setOverflowing] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  // Only duplicate the content and auto-scroll when it's actually wider than its container.
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    function measure() {
      if (!scroller || !content) return;
      setOverflowing(content.scrollWidth > scroller.clientWidth + 2);
    }
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(scroller);
    ro.observe(content);
    return () => ro.disconnect();
  }, [children]);

  // Auto-scroll via native scrollLeft (not a CSS transform) so dragging never fights it.
  React.useEffect(() => {
    if (!overflowing || interacting || shouldReduceMotion) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf: number;
    let last = performance.now();
    // Track position ourselves instead of reading scrollLeft back each frame —
    // the DOM value is rounded to whole pixels, so at low speeds each frame's
    // sub-pixel increment would be lost to rounding and the scroll would never
    // advance at all (stuck forever at the first rounded value).
    let position = scroller.scrollLeft;

    function step(now: number) {
      const el = scrollerRef.current;
      if (el) {
        const dt = (now - last) / 1000;
        last = now;
        position += pxPerSecond * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && position >= half) position -= half;
        el.scrollLeft = position;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [overflowing, interacting, shouldReduceMotion, pxPerSecond]);

  React.useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  function pause() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setInteracting(true);
  }
  function resumeSoon() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setInteracting(false), 1800);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Only hijack mouse drags — touch already scrolls natively and feels better left alone.
    if (e.pointerType !== "mouse" || !scrollerRef.current) return;
    drag.current = { active: true, startX: e.clientX, startScrollLeft: scrollerRef.current.scrollLeft, movedPastThreshold: false, captured: false };
    setDragging(true);
    pause();
    // Don't capture the pointer yet — capturing immediately would redirect the
    // eventual pointerup/click away from whatever's under the cursor (e.g. a
    // gallery photo or news card button), breaking plain clicks entirely.
    // Only capture once the gesture is confirmed to be a real drag.
  }
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active || !scrollerRef.current) return;
    const delta = e.clientX - drag.current.startX;
    scrollerRef.current.scrollLeft = drag.current.startScrollLeft - delta;
    if (!drag.current.movedPastThreshold && Math.abs(delta) > 5) {
      drag.current.movedPastThreshold = true;
      drag.current.captured = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }
  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    if (drag.current.captured) e.currentTarget.releasePointerCapture(e.pointerId);
    resumeSoon();

    // Dragged far enough that this wasn't a click — swallow the click that would
    // otherwise fire on release so cards/links underneath don't navigate by accident.
    if (drag.current.movedPastThreshold) {
      const scroller = scrollerRef.current;
      scroller?.addEventListener(
        "click",
        (clickEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
        },
        { capture: true, once: true }
      );
    }
  }

  return (
    <div className={cn("relative -my-3", className)} role="region" aria-label={ariaLabel}>
      <div
        ref={scrollerRef}
        className={cn(
          "no-scrollbar flex overflow-x-auto py-3",
          gapClassName,
          overflowing && "[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]",
          overflowing && (dragging ? "cursor-grabbing" : "cursor-grab")
        )}
        onMouseEnter={pause}
        onMouseLeave={resumeSoon}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={pause}
        onTouchEnd={resumeSoon}
        onDragStart={(e) => e.preventDefault()}
      >
        <div ref={contentRef} className={cn("flex flex-shrink-0", gapClassName)}>
          {children}
        </div>
        {overflowing && (
          <div className={cn("flex flex-shrink-0", gapClassName)} aria-hidden="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
