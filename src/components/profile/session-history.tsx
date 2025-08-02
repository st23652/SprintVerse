
'use client';

import { useEffect, useState } from 'react';
import { getSessionHistory } from '@/lib/firestore';
import type { Session } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

interface SessionHistoryProps {
    userId: string;
}

export default function SessionHistory({ userId }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const sessionHistory = await getSessionHistory(userId);
      setSessions(sessionHistory);
      setLoading(false);
    };
    fetchHistory();
  }, [userId]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Session History</CardTitle>
        <CardDescription>Review your past focus sprints.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
            ))
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                    <p className="font-semibold">{session.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {session.createdAt?.toDate().toLocaleDateString() || 'Date not available'}
                    </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/session/${session.id}`}>
                        View <ArrowRight className="ml-2" />
                    </Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground p-8">You haven't completed any sessions yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
