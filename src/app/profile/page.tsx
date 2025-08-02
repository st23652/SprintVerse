
'use client';

import Header from '@/components/layout/header';
import ProfileCard from '@/components/profile/profile-card';
import SessionHistory from '@/components/profile/session-history';
import SettingsCard from '@/components/profile/settings-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function ProfilePage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto grid max-w-4xl gap-8">
             <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                <div className="lg:col-span-1">
                    <Skeleton className="h-64 rounded-lg" />
                </div>
                <div className="lg:col-span-2">
                    <Skeleton className="h-96 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg mt-8" />
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
        <div className="mx-auto grid max-w-4xl gap-8">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">
            Your Profile
          </h1>

          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <ProfileCard user={user} />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-8">
              <SessionHistory userId={user.uid} />
              <SettingsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
