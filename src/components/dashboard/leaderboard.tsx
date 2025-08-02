'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/firestore';
import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('');
};

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 2) return <Crown className="h-5 w-5 text-amber-700" />;
  return <span className="text-sm font-medium text-muted-foreground w-5 text-center">{rank + 1}</span>;
};

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const leaderboardUsers = await getLeaderboard();
      // MOCK DATA for display purposes if firestore is not connected
      if (leaderboardUsers.length === 0) {
        setUsers([
          { uid: '1', displayName: 'Ada Lovelace', email: '', photoURL: 'https://placehold.co/40x40.png', points: 2540, streak: 12, totalSprints: 120 },
          { uid: '2', displayName: 'Grace Hopper', email: '', photoURL: 'https://placehold.co/40x40.png', points: 2310, streak: 8, totalSprints: 110 },
          { uid: '3', displayName: 'Alan Turing', email: '', photoURL: 'https://placehold.co/40x40.png', points: 2100, streak: 15, totalSprints: 100 },
          { uid: '4', displayName: 'Linus Torvalds', email: '', photoURL: 'https://placehold.co/40x40.png', points: 1980, streak: 5, totalSprints: 95 },
          { uid: '5', displayName: 'Margaret Hamilton', email: '', photoURL: 'https://placehold.co/40x40.png', points: 1850, streak: 9, totalSprints: 90 },
        ]);
      } else {
        setUsers(leaderboardUsers);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Leaderboard</CardTitle>
        <CardDescription>Top 10 sprinters across the verse.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                  <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              users.map((user, index) => (
                <TableRow key={user.uid} className={index < 3 ? 'bg-secondary/50' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <RankIcon rank={index} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage data-ai-hint="person" src={user.photoURL || `https://placehold.co/40x40.png?text=${getInitials(user.displayName)}`} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">{user.points.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
