
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Rocket, Star } from 'lucide-react';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User;
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('');
};

export default function ProfileCard({ user }: ProfileCardProps) {
    const stats = [
    {
      title: 'Total Sprints',
      value: user.totalSprints,
      icon: Rocket,
    },
    {
      title: 'Current Streak',
      value: user.streak,
      icon: Flame,
    },
    {
      title: 'Total Points',
      value: user.points,
      icon: Star,
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
          <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-2xl pt-4">{user.displayName}</CardTitle>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {stats.map(stat => (
                 <div key={stat.title} className="flex items-center justify-between text-sm p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                        <stat.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-muted-foreground">{stat.title}</span>
                    </div>
                    <span className="font-bold text-foreground">{stat.value.toLocaleString()}</span>
                 </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
