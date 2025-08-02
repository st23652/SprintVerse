'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createSession, joinSession } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Users } from 'lucide-react';

const createSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.').max(50, 'Title is too long.'),
});

const joinSchema = z.object({
  sessionId: z.string().min(10, 'Invalid Session ID.').max(30, 'Invalid Session ID.'),
});

interface SessionActionsProps {
  user: User;
}

export default function SessionActions({ user }: SessionActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: '' },
  });

  const joinForm = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: { sessionId: '' },
  });

  const handleCreateSession = async (values: z.infer<typeof createSchema>) => {
    setIsCreating(true);
    const sessionId = await createSession(values.title, user);
    if (sessionId) {
      toast({ title: 'Success', description: 'Session created successfully!' });
      router.push(`/session/${sessionId}`);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create session.' });
    }
    setIsCreating(false);
  };

  const handleJoinSession = async (values: z.infer<typeof joinSchema>) => {
    setIsJoining(true);
    const success = await joinSession(values.sessionId, user);
    if(success) {
      toast({ title: 'Success', description: 'Joined session!' });
      router.push(`/session/${values.sessionId}`);
    } else {
       toast({ variant: 'destructive', title: 'Error', description: 'Could not find or join session.' });
    }
    setIsJoining(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Start a Sprint</CardTitle>
        <CardDescription>Create a new session or join an existing one.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="pt-4">
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateSession)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Q3 Project Grind" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isCreating}>
                  <Rocket className="mr-2" /> {isCreating ? 'Creating...' : 'Create Session'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="join" className="pt-4">
            <Form {...joinForm}>
              <form onSubmit={joinForm.handleSubmit(handleJoinSession)} className="space-y-4">
                <FormField
                  control={joinForm.control}
                  name="sessionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter session ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isJoining}>
                  <Users className="mr-2" /> {isJoining ? 'Joining...' : 'Join Session'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
