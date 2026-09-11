import React, { useRef } from 'react';
import type { MouseEvent } from 'react';

interface WaveformProps {
    waveform: number[];
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
}

const Waveform: React.FC<WaveformProps> = ({ waveform, currentTime, duration, onSeek }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || duration === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = clickX / width;
        const seekTime = ratio * duration;
        onSeek(seekTime);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '00:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4 select-none w-full relative group/player">
            {/* Ambient Background Glow behind waveform */}
            <div className="absolute inset-0 bg-teal-500/5 blur-2xl rounded-full pointer-events-none transition-opacity duration-500"></div>

            {/* Futuristic Time Display */}
            <div className="flex justify-between items-center text-[11px] font-mono font-semibold tracking-widest px-2 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                    </span>
                    <span className="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">{formatTime(currentTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatTime(duration)}</span>
                    <span className="text-[8px] text-zinc-700 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">16kHz PCM</span>
                </div>
            </div>

            {/* Advanced Waveform Visualizer */}
            <div
                ref={containerRef}
                onClick={handleClick}
                className="h-24 flex items-center justify-between gap-[2px] cursor-pointer relative py-2 z-10"
                role="slider"
                aria-label="Audio timeline track scrubber"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
            >
                {/* Horizontal Center Line (Cyberpunk Axis) */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 shadow-[0_0_5px_rgba(255,255,255,0.1)] pointer-events-none z-0 -translate-y-1/2" />

                {/* Hover Scrubber Line */}
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover/player:opacity-100 pointer-events-none transition-all rounded-xl z-0" />

                {waveform.map((height, index) => {
                    const barPercent = (index / waveform.length) * 100;
                    const isPlayed = barPercent <= progressPercent;
                    
                    // Create symmetric bars (origin center) for that modern oscilloscope look
                    const scaleFactor = Math.max(height, 5);

                    return (
                        <div
                            key={index}
                            className={`w-full rounded-[1px] transition-all duration-150 z-10 relative flex flex-col justify-center items-center h-full`}
                        >
                            <div 
                                className={`w-full transition-all duration-300 ${
                                    isPlayed 
                                        ? 'bg-gradient-to-b from-teal-300 to-teal-500 shadow-[0_0_12px_rgba(45,212,191,0.6)]' 
                                        : 'bg-zinc-700/50 hover:bg-zinc-500'
                                }`}
                                style={{
                                    height: `${scaleFactor}%`,
                                    // Slight pulse effect on played bars based on height
                                    transform: isPlayed && height > 50 ? 'scaleY(1.05)' : 'none',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Waveform;
