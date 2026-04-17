import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import OverlayEffects from './components/OverlayEffects';

export default function App() {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4">
      {/* Background Visual Effects */}
      <OverlayEffects />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        
        {/* Left Side: Diagnostics / Lore */}
        <div className="hidden lg:flex flex-col w-64 neo-border bg-black/50 p-4 gap-4 backdrop-blur-md">
           <h1 className="glitch-text text-3xl font-bold border-b border-[var(--color-magenta)] pb-2" data-text="TERMINAL_v9">TERMINAL_v9</h1>
           <div className="text-xs text-green-500 opacity-80 flex flex-col gap-1 space-y-1">
             <p>&gt; INITIALIZING CORE...</p>
             <p className="animate-pulse">&gt; BYPASSING SECURITY...</p>
             <p>&gt; LINK_ESTABLISHED.</p>
             <br/>
             <p className="text-[var(--color-cyan)]">PROTOCOL: NEON_SERPENT</p>
             <p className="text-[var(--color-cyan)]">AWAITING INPUT...</p>
           </div>
           
           <div className="mt-auto pt-4 border-t border-[var(--color-cyan)] text-[10px] text-gray-500">
             WARNING: PROLONGED EXPOSURE MAY CAUSE COGNITIVE DRIFT.
           </div>
        </div>

        {/* Center: The Game */}
        <div className="flex-1 flex justify-center">
          <SnakeGame />
        </div>

        {/* Right Side: Music Player */}
        <div className="flex flex-col gap-4">
          <MusicPlayer />
          
          <div className="w-72 neo-border-magenta bg-black/50 p-4 backdrop-blur-md hidden lg:block">
            <h3 className="text-sm border-b border-[var(--color-cyan)] pb-1 mb-2 text-[var(--color-magenta)]">SYS.INSTRUCTIONS</h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li><span className="text-[var(--color-cyan)]">WASD / ARROWS:</span> NAVIGATE SECTOR</li>
              <li><span className="text-[var(--color-cyan)]">P / ESC:</span> SUSPEND PROTOCOL</li>
              <li><span className="text-[var(--color-cyan)]">SPACE:</span> AUX RELAY (DISABLED)</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}
