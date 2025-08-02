'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Rocket, Star } from 'lucide-react';
import type { User } from '@/types';

interface StatsCardsProps {
  user: User;
}

export default function StatsCards({ user }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Sprints',
      value: user.totalSprints,
      icon: Rocket,
      color: 'text-purple-500',
    },
    {
      title: 'Current Streak',
      value: user.streak,
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      title: 'Total Points',
      value: user.points,
      icon: Star,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
