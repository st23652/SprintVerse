'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { signInWithGoogle, signInWithGitHub, signInWithEmail, sendPhoneVerification, verifyPhoneCode } from '@/lib/firebase';
import { Rocket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.132,44,30.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
}

function GithubIcon() {
    return (
        <svg className="size-4" viewBox="0 0 16 16">
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
    )
}

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await signInWithEmail(email, password);
    if (!success) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Please check your email and password.' });
    }
    setIsSubmitting(false);
  }
  
  const handleSendCode = async () => {
    setIsSubmitting(true);
    const verifId = await sendPhoneVerification(phone);
    if (verifId) {
        setVerificationId(verifId);
        toast({ title: 'Code Sent', description: 'Check your phone for the verification code.'});
    } else {
        toast({ variant: 'destructive', title: 'Failed to send code', description: 'Please check the phone number.'});
    }
    setIsSubmitting(false);
  }

  const handleVerifyCode = async () => {
    if (!verificationId) return;
    setIsSubmitting(true);
    const success = await verifyPhoneCode(verificationId, code);
    if (!success) {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid verification code.'});
    }
    setIsSubmitting(false);
  }

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
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your focus journey.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={signInWithGoogle}><GoogleIcon /> Google</Button>
                <Button variant="outline" onClick={signInWithGitHub}><GithubIcon /> GitHub</Button>
            </div>
            
            <div className="my-4 flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>

            {verificationId ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Verification Code</Label>
                        <Input id="code" type="text" placeholder="123456" value={code} onChange={e => setCode(e.target.value)} required />
                    </div>
                    <Button onClick={handleVerifyCode} className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Sign In with Phone'}
                    </Button>
                </div>
            ) : (
                <>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing In...' : 'Sign In with Email'}</Button>
                </form>

                <div className="my-4 flex items-center">
                    <Separator className="flex-1" />
                    <span className="mx-4 text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 123 456 7890" value={phone} onChange={e => setPhone(e.target.value)} required />
                    </div>
                    <div id="recaptcha-container"></div>
                    <Button onClick={handleSendCode} className="w-full" variant="secondary" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
                    </Button>
                </div>
                </>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
