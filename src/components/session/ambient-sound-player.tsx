
'use client';

import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trees, Coffee, CloudRain, Volume2, VolumeX } from 'lucide-react';

type Sound = 'forest' | 'cafe' | 'rain';

const soundOptions: { id: Sound; label: string; icon: React.ElementType, url: string }[] = [
  { id: 'forest', label: 'Forest', icon: Trees, url: '/sounds/forest.mp3' },
  { id: 'cafe', label: 'Cafe', icon: Coffee, url: '/sounds/cafe.mp3' },
  { id: 'rain', label: 'Rain', icon: CloudRain, url: '/sounds/rain.mp3' },
];

export default function AmbientSoundPlayer() {
  const [activeSound, setActiveSound] = useState<Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const player = useRef<Tone.Player | null>(null);

  // Cleanup effect to stop and dispose of the player on unmount
  useEffect(() => {
    return () => {
        player.current?.stop();
        player.current?.dispose();
    }
  }, []);
  
  const toggleSound = async (sound: Sound) => {
    await Tone.start(); 

    // If the same sound is clicked again, stop it.
    if (activeSound === sound) {
      player.current?.stop();
      player.current?.dispose();
      player.current = null;
      setActiveSound(null);
      return;
    }

    // If a different sound is playing, stop and dispose of it first.
    if(player.current) {
        player.current.stop();
        player.current.dispose();
    }
    
    const selectedSound = soundOptions.find(s => s.id === sound);
    if (selectedSound) {
      // Create a new player, load the sound, and start it.
      player.current = new Tone.Player({
        url: selectedSound.url,
        loop: true,
        autostart: true, // Autostart after loading
        mute: isMuted,
      }).toDestination();
      
      // Handle potential loading errors
      player.current.onstop = () => {
        player.current?.dispose();
      }
      
      setActiveSound(sound);
    }
  };
  
  const toggleMute = () => {
    const newMutedState = !isMuted;
    if(player.current) {
        player.current.mute = newMutedState;
    }
    setIsMuted(newMutedState);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Ambient Sounds</CardTitle>
        <Button variant="ghost" size="icon" onClick={toggleMute} disabled={!activeSound}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
        {soundOptions.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeSound === id ? 'default' : 'outline'}
            onClick={() => toggleSound(id)}
            className="flex flex-col h-20 gap-2"
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
