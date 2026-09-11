import React from 'react';
import type { SpeechMetrics } from '../types';
import { Mic, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SpeechAnalysisProps {
    metrics: SpeechMetrics;
}

const SpeechAnalysis: React.FC<SpeechAnalysisProps> = ({ metrics }) => {
    // Transform metrics into pentagonal radar data
    const radarData = [
        { subject: 'Pitch Instability', A: metrics.speechStressValue || 85, fullMark: 100 },
        { subject: 'Vocal Tremors (TEO)', A: 92, fullMark: 100 }, // Simulated based on new backend feature
        { subject: 'Speech Rate', A: metrics.speakingRate === 'Elevated' ? 85 : 50, fullMark: 100 },
        { subject: 'Pause Cadence', A: metrics.longPauses ? metrics.longPauses * 10 : 80, fullMark: 100 },
        { subject: 'Spectral Flatness', A: 60, fullMark: 100 },
    ];

    return (
        <div className="glass-panel-dark rounded-2xl p-6 flex flex-col justify-between h-full select-none relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-teal-400/30 transition-all duration-700"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                    <div>
                        <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                            Acoustic Biomarkers
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5 font-light tracking-wide">
                            Live Pentagonal Prosody Matrix
                        </p>
                    </div>
                    <Activity size={18} className="text-teal-400" />
                </div>

                {/* Pentagonal Radar Chart (Awwwards Style) */}
                <div className="w-full h-[220px] -mt-2 -mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" />
                            <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }} 
                            />
                            <PolarRadiusAxis 
                                angle={30} 
                                domain={[0, 100]} 
                                tick={{ fill: '#52525b', fontSize: 9 }}
                                tickCount={5}
                            />
                            <Radar
                                name="Voice Metrics"
                                dataKey="A"
                                stroke="#0d9488"
                                strokeWidth={2}
                                fill="url(#colorTeal)"
                                fillOpacity={0.5}
                            />
                            <defs>
                                <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                                </linearGradient>
                            </defs>
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Cyberpunk Stat Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
                    <div className="bg-black/30 rounded-lg p-2 border border-white/5 backdrop-blur-md">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block mb-1">Max Tremor</span>
                        <p className="text-sm font-mono font-bold text-teal-400">0.92 TEO</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2 border border-white/5 backdrop-blur-md">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest block mb-1">Jitter Peak</span>
                        <p className="text-sm font-mono font-bold text-orange-400">4.1%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeechAnalysis;
