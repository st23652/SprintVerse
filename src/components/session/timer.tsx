
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';

interface TimerProps {
  timeLeft: number;
  status: 'waiting' | 'running' | 'paused' | 'finished';
  onComplete: () => void;
}

const SPRINT_DURATION = 25 * 60; // 25 minutes in seconds

export default function Timer({ timeLeft, status, onComplete }: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((SPRINT_DURATION - timeLeft) / SPRINT_DURATION) * 100;

  return (
    <Card className="relative flex aspect-video w-full items-center justify-center overflow-hidden shadow-2xl shadow-primary/10">
      <div
        className="absolute bottom-0 left-0 top-0 bg-primary/10 transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
      <CardContent className="relative z-10 p-6 text-center">
        {status === 'finished' ? (
             <div className="flex flex-col items-center gap-4">
                <h2 className="font-headline text-5xl md:text-7xl font-bold text-primary">Sprint Complete!</h2>
                <p className="text-lg text-muted-foreground">Great work. Time for a break!</p>
             </div>
        ) : timeLeft === 0 && status === 'running' ? (
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-primary">Time's up!</h2>
            <Button size="lg" onClick={onComplete}>Complete Sprint & Take a Break</Button>
          </div>
        ) : (
          <div className="font-mono text-6xl font-bold tracking-tighter text-foreground/80 md:text-8xl lg:text-9xl">
            {formatTime(timeLeft)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
