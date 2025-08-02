'use client';

import { useState, useEffect } from 'react';
import type { Participant } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface ParticipantsListProps {
  participants: Participant[];
  sessionStatus: 'waiting' | 'running' | 'paused' | 'finished';
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('');
};

const SPRINT_DURATION = 25 * 60; // 25 minutes

export default function ParticipantsList({ participants, sessionStatus }: ParticipantsListProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStatus === 'running') {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
            const newTime = prev + 1;
            return newTime > SPRINT_DURATION ? SPRINT_DURATION : newTime;
        });
      }, 1000);
    } else if (sessionStatus === 'finished') {
        setTimeElapsed(SPRINT_DURATION);
    } else {
      setTimeElapsed(0);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);
  
  const calculateProgress = (participant: Participant) => {
      if (sessionStatus === 'finished' || participant.status === 'completed') {
          return 100;
      }
      if (sessionStatus !== 'running') {
          return 0;
      }
      return (timeElapsed / SPRINT_DURATION) * 100;
  }

  return (
    <div className="space-y-4">
      {participants.map((participant) => (
        <div key={participant.uid} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-secondary">
              <AvatarImage data-ai-hint="person avatar" src={participant.photoURL || ''} />
              <AvatarFallback>{getInitials(participant.displayName)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{participant.displayName}</span>
          </div>
          <Progress value={calculateProgress(participant)} className="h-2" />
        </div>
      ))}
    </div>
  );
}
