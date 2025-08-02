'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

export default function SpotifyPlayer() {
  // A great public playlist for focusing
  const playlistUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui02BsH?utm_source=generator&theme=0";

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl font-bold flex items-center gap-2">
          <Music /> Focus Playlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          style={{ borderRadius: '12px' }}
          src={playlistUrl}
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen={false}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Playlist Player"
        ></iframe>
      </CardContent>
    </Card>
  );
}
