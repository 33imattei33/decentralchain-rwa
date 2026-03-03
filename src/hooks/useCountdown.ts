"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}

/**
 * Real-time countdown hook.
 * Supports "Golden Minute" extension — if `extendOnBid` is called
 * and fewer than 60 s remain, the deadline shifts forward by 60 s.
 */
export function useCountdown(initialDeadline: Date) {
  const [deadline, setDeadline] = useState<Date>(initialDeadline);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calc(initialDeadline));
  const raf = useRef<number>(0);

  // Granular rAF-based tick for smooth second transitions
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const tl = calc(deadline);
      setTimeLeft(tl);
      if (tl.total > 0) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf.current);
    };
  }, [deadline]);

  /** Golden Minute: extend deadline by 60 s if < 60 s remain */
  const extendOnBid = useCallback(() => {
    const remaining = deadline.getTime() - Date.now();
    if (remaining > 0 && remaining < 60_000) {
      setDeadline(new Date(deadline.getTime() + 60_000));
    }
  }, [deadline]);

  return { timeLeft, extendOnBid, deadline };
}

function calc(deadline: Date): TimeLeft {
  const total = Math.max(0, deadline.getTime() - Date.now());
  return {
    total,
    expired: total <= 0,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1_000) % 60),
  };
}
