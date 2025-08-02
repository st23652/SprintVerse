'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Timer } from 'lucide-react';
import { Progress } from '../ui/progress';

interface BreakSuggestionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: string | null;
}

const BREAK_DURATION = 5 * 60; // 5 minutes

export default function BreakSuggestionModal({ isOpen, onOpenChange, suggestion }: BreakSuggestionModalProps) {
  const [timeLeft, setTimeLeft] = useState(BREAK_DURATION);
  const [isBreakActive, setIsBreakActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsBreakActive(false);
      setTimeLeft(BREAK_DURATION);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isBreakActive || timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isBreakActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreak = () => {
    setIsBreakActive(true);
  }

  const handleClose = () => {
    onOpenChange(false);
  }

  const progress = ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="text-primary" />
            Time for a break!
          </DialogTitle>
          <DialogDescription>
            Here's a suggestion to make the most of your 5-minute break.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-lg font-semibold">{suggestion || 'Loading suggestion...'}</p>
        </div>
        <div className="space-y-4">
            {isBreakActive ? (
                <div className="space-y-2">
                    <div className="font-mono text-4xl text-center font-bold">{formatTime(timeLeft)}</div>
                    <Progress value={progress} />
                </div>
            ) : (
                <Button className="w-full" onClick={startBreak}>
                    <Timer className="mr-2 h-4 w-4" /> Start 5-Minute Break Timer
                </Button>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {isBreakActive && timeLeft > 0 ? "I'm Done Early" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
