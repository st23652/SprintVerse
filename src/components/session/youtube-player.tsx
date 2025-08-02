
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube } from 'lucide-react';

export default function YoutubePlayer() {
  // Lofi Girl - lofi hip hop radio - beats to relax/study to
  const videoId = "jfKfPfyJRdk";
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl font-bold flex items-center gap-2">
          <Youtube /> Focus Playlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          style={{ borderRadius: '12px' }}
          src={videoUrl}
          width="100%"
          height="200"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video Player"
        ></iframe>
      </CardContent>
    </Card>
  );
}
