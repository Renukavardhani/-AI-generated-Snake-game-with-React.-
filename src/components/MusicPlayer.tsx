import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Square, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 'TRK_01', title: 'NEUROMANCER_BETA', url: 'https://actions.google.com/sounds/v1/science_fiction/ambient_hum.ogg' },
  { id: 'TRK_02', title: 'VOID_SYNTH_04', url: 'https://actions.google.com/sounds/v1/science_fiction/space_engine.ogg' },
  { id: 'TRK_03', title: 'SYS_OVERRIDE_HACK', url: 'https://actions.google.com/sounds/v1/science_fiction/alien_beacon.ogg' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="neo-border bg-black/80 p-4 flex flex-col gap-4 backdrop-blur-sm relative overflow-hidden group w-72">
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-magenta)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
      
      <div className="flex justify-between items-center border-b border-[var(--color-cyan)] pb-2">
        <h2 className="glitch-text text-xl" data-text="SYS.AUDIO">SYS.AUDIO</h2>
        <div className="flex items-center gap-2">
          {isPlaying && <span className="animate-pulse text-[var(--color-magenta)]">● REC</span>}
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[var(--color-magenta)] transition-colors">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[var(--color-cyan)] opacity-70">CURRENT_TARGET:</span>
        <div className="truncate text-lg terminal-text-magenta animate-pulse" title={currentTrack.title}>
          {currentTrack.title}
        </div>
        <span className="text-xs text-gray-500">{currentTrack.id} [AI_GEN]</span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button className="p-2 hover:bg-[var(--color-cyan)] hover:text-black neo-border transition-all" onClick={prevTrack}>
          <SkipBack size={18} />
        </button>
        <button className="p-3 neo-border-magenta hover:bg-[var(--color-magenta)] hover:text-black transition-all" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="p-2 hover:bg-[var(--color-cyan)] hover:text-black neo-border transition-all" onClick={nextTrack}>
          <SkipForward size={18} />
        </button>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        loop={false}
      />
    </div>
  );
}
