'use client';

import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary">SprintVerse</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full overflow-hidden py-20 md:py-32 lg:py-40">
           <div className="absolute inset-0 bg-grid-purple-500/[0.05] bg-background [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"></div>
          <div className="container relative mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
            <div className="space-y-6">
              <h2 className="font-headline text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-5xl md:text-6xl">
                Focus, Together.
              </h2>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                Transform your focus sessions into collaborative sprints. Earn points, track progress, and conquer your goals with friends.
              </p>
               <Button size="lg" className="h-12 text-base" asChild>
                 <Link href="/register">
                    Get Started for Free
                    <ArrowRight className="ml-2" />
                 </Link>
              </Button>
            </div>
            <div className="relative rounded-xl bg-card p-6 shadow-2xl shadow-primary/20">
               <div className="absolute -right-4 -top-4 size-16 rounded-full bg-accent/20 blur-2xl"></div>
               <div className="absolute -bottom-8 left-1/2 size-20 rounded-full bg-primary/20 blur-3xl"></div>
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="App Screenshot"
                data-ai-hint="team collaboration"
                className="w-full rounded-lg border"
              />
            </div>
          </div>
        </section>
        <section className="w-full bg-secondary/50 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h3 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features to Boost Your Flow</h3>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to stay on track and make progress, gamified.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg bg-card p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <Rocket className="h-10 w-10 text-primary" />
                <h4 className="font-headline text-xl font-bold">Focus Sprints</h4>
                <p className="text-muted-foreground">Classic 25-minute Pomodoro sessions to keep you locked in.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg bg-card p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <Users className="h-10 w-10 text-primary" />
                <h4 className="font-headline text-xl font-bold">Team Battles</h4>
                <p className="text-muted-foreground">Join sessions with others and see real-time progress.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg bg-card p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <Sparkles className="h-10 w-10 text-primary" />
                <h4 className="font-headline text-xl font-bold">AI-Powered Breaks</h4>
                <p className="text-muted-foreground">Get smart suggestions for your 5-minute rests.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SprintVerse. All rights reserved.
      </footer>
    </div>
  );
}
