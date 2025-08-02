'use client';

import { useRequireAuth } from '@/hooks/use-require-auth';
import Header from '@/components/layout/header';
import StatsCards from '@/components/dashboard/stats-cards';
import SessionActions from '@/components/dashboard/session-actions';
import Leaderboard from '@/components/dashboard/leaderboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto grid max-w-6xl gap-8">
            <div className="grid gap-8 md:grid-cols-3">
              <Skeleton className="h-36 rounded-lg" />
              <Skeleton className="h-36 rounded-lg" />
              <Skeleton className="h-36 rounded-lg" />
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Skeleton className="h-48 rounded-lg" />
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-96 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid max-w-6xl gap-8">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">
            Welcome back, {user.displayName?.split(' ')[0] || 'Sprinter'}!
          </h1>
          
          <StatsCards user={user} />

          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-1">
              <SessionActions user={user} />
            </div>

            <div className="lg:col-span-2">
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
