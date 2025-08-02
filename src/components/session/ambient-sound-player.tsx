
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

  // Initialize the player on component mount
  useEffect(() => {
    player.current = new Tone.Player({
        loop: true,
        mute: isMuted,
    }).toDestination();

    // Cleanup on unmount
    return () => {
        player.current?.dispose();
    }
  }, [isMuted]); // Re-create player if mute state changes, just in case.

  const toggleSound = async (sound: Sound) => {
    await Tone.start();
    const soundPlayer = player.current;
    
    if (!soundPlayer) return;

    // If the same sound is clicked, stop it.
    if (activeSound === sound) {
      soundPlayer.stop();
      setActiveSound(null);
      return;
    }

    // Load and play the new sound
    const selectedSound = soundOptions.find(s => s.id === sound);
    if (selectedSound) {
        if (soundPlayer.state === 'started') {
            soundPlayer.stop();
        }
        await soundPlayer.load(selectedSound.url);
        soundPlayer.start();
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
