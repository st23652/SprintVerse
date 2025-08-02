
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type TimerStatus = 'waiting' | 'running' | 'paused' | 'finished';

interface UseTimerProps {
  initialTime: number;
  onComplete?: () => void;
}

export function useTimer({ initialTime, onComplete }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [status, setStatus] = useState<TimerStatus>('waiting');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearTimerInterval();
            setStatus('finished');
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }

    return clearTimerInterval; // Cleanup on unmount or status change
  }, [status]);

  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setStatus('waiting');
    setTimeLeft(initialTime);
  }, [initialTime]);

  return { timeLeft, status, setStatus, resetTimer };
}
