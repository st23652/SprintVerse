
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

export default function SettingsCard() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Ensure the switch reflects the current theme on mount
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    setIsDarkMode(checked);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3"><Settings /> Settings</CardTitle>
        <CardDescription>Manage your account and notification settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <Label htmlFor="notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive emails about new session invites and weekly summaries.
            </span>
          </Label>
          <Switch id="notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
           <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
            <span>Dark Mode</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Toggle the application's theme.
            </span>
          </Label>
          <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
        </div>
      </CardContent>
    </Card>
  );
}
