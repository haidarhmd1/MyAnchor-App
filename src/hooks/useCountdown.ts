import { useCallback, useEffect, useRef, useState } from "react";
import { playBeep } from "../common/utils/beep";

export const useCountdown = (
  duration: number,
  preCountdown: number = 3,
  opts?: { onFinish?: () => void },
) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPrecountdown, setIsPrecountdown] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPrecountdown(true);
    setCountdown(Math.max(0, Math.floor(preCountdown)));
    playBeep(200, 800); // precountdown beep
  };

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsPrecountdown(false);
    setCountdown(null);
  }, []);

  useEffect(() => {
    if (!isRunning || countdown === null) return;

    if (countdown === 0) {
      if (isPrecountdown) {
        setIsPrecountdown(false);
        playBeep(400, 1000); // start beep
        if (duration > 0) {
          setCountdown(Math.floor(duration));
        } else {
          stop();
          playBeep(600, 1200); // end beep
          opts?.onFinish?.();
        }
      } else {
        stop();
        playBeep(600, 1200); // end beep
        opts?.onFinish?.();
      }
      return;
    }

    // Precount beep each second
    if (isPrecountdown) playBeep(200, 800);

    timerRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearTimer();
  }, [countdown, isRunning, isPrecountdown, duration, stop, opts]);

  return { countdown, isRunning, isPrecountdown, start, stop };
};
