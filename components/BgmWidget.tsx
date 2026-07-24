import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music } from 'lucide-react';

interface NoteParticle {
  id: number;
  char: string;
  left: number;
  bottom: number;
  scale: number;
  rotate: number;
}

export default function BgmWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<NoteParticle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particleId = useRef(0);

  // Handle music playing states
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Audio play blocked by browser or failed:", err);
          // Try playing again or alert user gracefully
        });
    }
  };

  // Periodically spawn musical notes when music is active
  useEffect(() => {
    if (!isPlaying) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      const notes = ['🎵', '🎶', '✨', '🌸', '💖'];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      
      const newParticle: NoteParticle = {
        id: particleId.current++,
        char: randomNote,
        left: Math.random() * 80 + 10, // percentage offset within widget
        bottom: 40,
        scale: Math.random() * 0.4 + 0.8,
        rotate: (Math.random() - 0.5) * 45,
      };

      setParticles((prev) => [...prev, newParticle]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update note particles position (float up)
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            bottom: p.bottom + 2,
            scale: Math.max(0, p.scale - 0.015),
          }))
          .filter((p) => p.scale > 0.1 && p.bottom < 150)
      );
    }, 30);

    return () => clearInterval(timer);
  }, [particles]);

  return (
    <div 
      id="bgm-player-widget"
      className="absolute z-[9999] glass-panel-heavy rounded-[30px] p-3 px-4 flex items-center gap-3 candy-glow-pink border-pink-200 shadow-lg select-none"
      style={{ 
        top: '10px', 
        right: '172px',
        width: '316.131px',
        height: '49.4358px',
        marginTop: '10px',
        borderColor: '#fa67a9',
        paddingRight: '19px',
        marginLeft: '4px',
        marginRight: '-150px',
        paddingLeft: '17px',
        marginBottom: '-10px',
        touchAction: 'none',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)'
      }}
    >
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-sun-valley-582.mp3" /* REPLACE THIS LINK WITH YOUR OWN LOFI MP3 PLAYLIST URL */
        loop
        preload="auto"
      />

      {/* Floating Notes */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-sm transition-all duration-300 font-sans leading-none"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}px`,
              transform: `scale(${p.scale}) rotate(${p.rotate}deg)`,
              opacity: p.scale,
              filter: 'drop-shadow(0 2px 4px rgba(255,105,180,0.3))',
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Rotating Music Note Icon */}
      <div className={`p-2 bg-pink-100 rounded-full text-pink-500 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
        <Music size={18} className="stroke-[2.5]" />
      </div>

      {/* Track Name */}
      <div className="flex flex-col">
        <span className="font-itim text-pink-500 font-medium text-sm whitespace-nowrap tracking-wider">
          BGM: Playlist Cá Khô Lofi 🐟
        </span>
        <span className="text-[10px] text-pink-400 font-quicksand mt-[-2px]">
          {isPlaying ? 'đang phát ngọt ngào...' : 'tạm dừng nhạc'}
        </span>
      </div>

      {/* Circular Play/Pause Button */}
      <button
        id="bgm-play-pause-btn"
        onClick={togglePlay}
        className="rounded-full bg-gradient-to-r from-pink-400 to-peach-300 hover:from-pink-500 hover:to-orange-400 text-white flex items-center justify-center transition-all duration-300 active:scale-90 shadow-md hover:shadow-pink-300/50 hover:scale-105"
        style={{
          width: '32.995400000000004px',
          height: '28.9862px',
          paddingRight: '0px',
          marginRight: '0px',
          marginBottom: '0px',
          marginLeft: '2px',
          paddingLeft: '0px'
        }}
      >
        {isPlaying ? (
          <Pause size={14} className="fill-white stroke-none" />
        ) : (
          <Play size={14} className="fill-white stroke-none ml-[2px]" />
        )}
      </button>
    </div>
  );
}
