'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Session, Participant } from '@/types';

import Header from '@/components/layout/header';
import Timer from '@/components/session/timer';
import ParticipantsList from '@/components/session/participants-list';
import AmbientSoundPlayer from '@/components/session/ambient-sound-player';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { completeSprint as completeSprintInDb } from '@/lib/firestore';
import { suggestBreak } from '@/ai/flows/suggest-break';
import BreakSuggestionModal from '@/components/session/break-suggestion-modal';

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const { user, loading: authLoading } = useRequireAuth();
  const { toast } = useToast();

  const [session, setSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<'waiting' | 'running' | 'paused' | 'finished'>('waiting');
  const [breakSuggestion, setBreakSuggestion] = useState<string | null>(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);

  useEffect(() => {
    if (!params.sessionId) return;
    setLoading(true);
    const sessionRef = doc(db, 'sessions', params.sessionId);
    const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSession({ id: docSnap.id, ...data } as Session);
        setParticipants(data.participants || []);
      } else {
        // Handle session not found
        console.error("Session not found");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.sessionId]);

  const copySessionLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Copied!', description: 'Session link copied to clipboard.' });
  };
  
  const handleStartSession = () => {
    // In a real app, you'd update the session status in Firestore
    setSessionStatus('running');
    toast({ title: 'Sprint Started!', description: 'Time to focus!' });
  }

  const handleCompleteSprint = async () => {
    if (!user) return;
    
    // 1. Update DB
    await completeSprintInDb(user.uid, params.sessionId, 10); // Award 10 points
    
    // 2. Update local state
    setSessionStatus('finished');
    
    // 3. Get AI suggestion
    try {
      const suggestionResult = await suggestBreak({
        sprintCount: 1, // This would be tracked in session state
        streak: user.streak + 1,
        totalSprints: user.totalSprints + 1
      });
      setBreakSuggestion(suggestionResult.suggestion);
    } catch(e) {
      console.error(e);
      setBreakSuggestion("Time for a well-deserved break! Maybe stretch a little?");
    }
    
    // 4. Show modal
    setIsBreakModalOpen(true);
  }

  if (loading || authLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 grid place-items-center">
                <Skeleton className="w-full max-w-4xl h-[600px] rounded-lg" />
            </main>
        </div>
    );
  }

  if (!session) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 grid place-items-center">
                <Card><CardContent className="p-8"><h2 className="font-headline text-2xl">Session not found</h2></CardContent></Card>
            </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 lg:items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card className="shadow-lg">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-headline text-3xl font-bold">{session.title}</h1>
                        <p className="text-muted-foreground">Session ID: {session.id}</p>
                    </div>
                    <Button variant="outline" onClick={copySessionLink}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                    </Button>
                </CardContent>
            </Card>

            <Timer
              status={sessionStatus}
              onComplete={handleCompleteSprint}
            />
            
            {sessionStatus === 'waiting' && (
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={handleStartSession}>Start Sprint</Button>
            )}

          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
             <Card className="shadow-lg">
                <CardContent className="p-6">
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2">
                        <Users /> Participants ({participants.length})
                    </h2>
                    <ParticipantsList participants={participants} sessionStatus={sessionStatus} />
                </CardContent>
            </Card>
            <AmbientSoundPlayer />
          </div>
        </div>
      </main>
      <BreakSuggestionModal 
        isOpen={isBreakModalOpen}
        onOpenChange={setIsBreakModalOpen}
        suggestion={breakSuggestion}
      />
    </div>
  );
}
