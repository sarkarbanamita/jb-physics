'use client';

import React, { useState } from 'react';
import { Youtube, Play, ExternalLink } from 'lucide-react';
import { extractYouTubeId } from '@/lib/utils';

interface YouTubeEmbedProps {
  url: string | null | undefined;
  timestamp?: number;
  title?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  timestamp = 0,
  title = 'Watch Detailed Video Solution',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(url);

  if (!videoId) return null;

  const startParam = timestamp > 0 ? `&start=${timestamp}` : '';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1${startParam}`;
  const directUrl = `https://www.youtube.com/watch?v=${videoId}${timestamp > 0 ? `&t=${timestamp}s` : ''}`;

  return (
    <div className="my-4 rounded-2xl border border-red-950/40 bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-950 p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-red-900/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-red-500/20 text-red-300 rounded font-semibold">
                JB Physics
              </span>
            </h4>
            {timestamp > 0 && (
              <span className="text-[10px] text-amber-400 font-mono">
                Starts at {Math.floor(timestamp / 60)}:{(timestamp % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition"
        >
          <span>Open on YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div
            onClick={() => setIsPlaying(true)}
            className="group relative w-full h-full cursor-pointer flex items-center justify-center bg-slate-900 overflow-hidden"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
            
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-red-600 group-hover:bg-red-500 group-hover:scale-110 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 transition duration-300">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
              <span className="text-xs font-bold text-white px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800">
                Click to Watch Explanation
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeEmbed;
