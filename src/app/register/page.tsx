'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { registerWithEmail } from '@/lib/firebase';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await registerWithEmail(email, password, displayName);
      if (!success) {
        // This case is unlikely if we catch the specific error, but good to have.
        toast({ variant: 'destructive', title: 'Registration Failed', description: 'An unexpected error occurred.' });
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'Email Already Registered',
          description: 'This email is already in use. Please log in instead.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: error.message || 'Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Rocket className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <Link href="/" className="flex items-center gap-2 justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
                <h1 className="font-headline text-2xl font-bold text-primary">SprintVerse</h1>
            </Link>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join SprintVerse to boost your productivity.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" type="text" placeholder="Ada Lovelace" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
