
import React, { useState } from 'react';
import type { VideoSettings, Model } from '../types';
import { improvePrompt } from '../services/geminiService';
import { ChevronDownIcon, WandIcon, SlidersIcon, ClockIcon, SpinnerIcon } from './icons';

interface ControlPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    settings: VideoSettings;
    setSettings: React.Dispatch<React.SetStateAction<VideoSettings>>;
    onGenerate: () => void;
    isGenerating: boolean;
    setError: (error: string | null) => void;
}

const actMotionModels: Model[] = [
    { name: "Warrior", imageUrl: "https://picsum.photos/seed/warrior/100/100" },
    { name: "Maiden", imageUrl: "https://picsum.photos/seed/maiden/100/100" },
    { name: "Cyborg", imageUrl: "https://picsum.photos/seed/cyborg/100/100" },
];

const effectModels: Model[] = [
    { name: "Uplifting", imageUrl: "https://picsum.photos/seed/uplifting/100/100" },
    { name: "Instant Art", imageUrl: "https://picsum.photos/seed/instantart/100/100" },
    { name: "Siren of the Sea", imageUrl: "https://picsum.photos/seed/siren/100/100" },
    { name: "Weeping Dragon", imageUrl: "https://picsum.photos/seed/dragon/100/100" },
];

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-[#2a2a2e] border border-gray-700/80 rounded-lg p-4 ${className}`}>
        {children}
    </div>
);

const SectionHeader: React.FC<{ title: string; beta?: boolean; available?: string; children?: React.ReactNode }> = ({ title, beta, available, children }) => (
    <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{title}</h3>
            {beta && <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">Beta</span>}
        </div>
        {available && <span className="text-sm text-gray-400">{available}</span>}
        {children}
    </div>
);

const ModelGrid: React.FC<{ models: Model[], selected: string | null, onSelect: (name: string) => void }> = ({ models, selected, onSelect }) => (
    <div className="grid grid-cols-4 gap-3">
        {models.map(model => (
            <div key={model.name} onClick={() => onSelect(model.name)} className="cursor-pointer group">
                <div className={`aspect-square rounded-md overflow-hidden transition-all border-2 ${selected === model.name ? 'border-purple-500 scale-105' : 'border-transparent group-hover:border-gray-500'}`}>
                    <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
                </div>
                <p className={`text-xs text-center mt-1 truncate ${selected === model.name ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{model.name}</p>
            </div>
        ))}
    </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ prompt, setPrompt, settings, setSettings, onGenerate, isGenerating, setError }) => {
    const [isImproving, setIsImproving] = useState(false);

    const handleImprovePrompt = async () => {
        if (!prompt) {
            setError("Please enter a prompt to improve.");
            return;
        }
        setIsImproving(true);
        setError(null);
        try {
            const improved = await improvePrompt(prompt);
            setPrompt(improved);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsImproving(false);
        }
    };

    return (
        <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f4f4f #1e1e1e' }}>
            <Card>
                <SectionHeader title="Real Motion 2.6">
                    <div className="flex items-center gap-2 text-sm bg-gray-800 p-1 rounded-md cursor-pointer">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-green-400">Active</span>
                        <ChevronDownIcon className="w-4 h-4"/>
                    </div>
                </SectionHeader>
                <SectionHeader title="ActMotion Gen-2" beta available="27 models available" />
                <div className="grid grid-cols-4 gap-3">
                    <div onClick={() => alert("Feature coming soon: Create your own custom motion models.")} className="flex flex-col items-center justify-center aspect-square bg-gray-800/50 rounded-md cursor-pointer hover:bg-gray-700/50 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        <span className="text-xs">Create</span>
                    </div>
                    <ModelGrid models={actMotionModels} selected={settings.actMotionModel} onSelect={(name) => setSettings(s => ({ ...s, actMotionModel: name }))} />
                </div>
            </Card>

            <Card>
                <SectionHeader title="Effect Models" beta available="79 models available" />
                <ModelGrid models={effectModels} selected={settings.effectModel} onSelect={(name) => setSettings(s => ({ ...s, effectModel: name }))} />
            </Card>

            <Card>
                <SectionHeader title="Video Prompt">
                     <button onClick={handleImprovePrompt} disabled={isImproving} className="text-sm flex items-center gap-1.5 bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isImproving ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <WandIcon className="w-4 h-4 text-purple-400" />}
                        <span>{isImproving ? 'Improving...' : 'Improve Prompt'}</span>
                    </button>
                </SectionHeader>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A cinematic, wide-angle shot of a majestic dragon flying through a stormy sky..."
                    className="w-full h-24 bg-gray-800/50 border border-gray-600 rounded-md p-2 text-sm placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
                    maxLength={1000}
                />
                <p className="text-right text-xs text-gray-500 mt-1">{prompt.length}/1000</p>
            </Card>
            
            <div className="grid grid-cols-2 gap-3">
                <Card>
                    <h3 className="font-semibold text-white mb-2">Lip Movement</h3>
                    <div className="aspect-video bg-black rounded-md overflow-hidden mb-2">
                        <img src="https://picsum.photos/seed/gorilla/200/120" alt="Lip sync example" className="w-full h-full object-cover"/>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">The new GEN-3 model generates highly realistic talking human videos with synchronized lip expressions, lip movements and speech.</p>
                    <button onClick={() => alert('GEN-3 Lip Sync model coming soon!')} className="w-full bg-gray-700 py-2 rounded-md text-sm font-semibold hover:bg-gray-600 transition-colors">Try it now</button>
                </Card>
                <div className="flex flex-col gap-3">
                    <Card className="flex-1">
                         <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-white">AI Sound Effects</h3>
                            <button className="text-gray-400 hover:text-white">
                                <SlidersIcon className="w-5 h-5"/>
                            </button>
                        </div>
                         <select
                            value={settings.audioTrack || ''}
                            onChange={(e) => setSettings(s => ({ ...s, audioTrack: e.target.value || null }))}
                            className="w-full bg-gray-800/50 border border-gray-600 p-2 rounded-md text-sm text-white focus:ring-1 focus:ring-purple-500 focus:outline-none appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="">No Music</option>
                            <option value="Cinematic Orchestral">Cinematic Orchestral</option>
                            <option value="Uplifting Piano">Uplifting Piano</option>
                            <option value="Lo-Fi Beats">Lo-Fi Beats</option>
                            <option value="Ambient Synthwave">Ambient Synthwave</option>
                            <option value="Epic Battle Rock">Epic Battle Rock</option>
                        </select>
                    </Card>
                    <Card>
                        <h3 className="font-semibold text-white mb-2">Video Control</h3>
                         <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <button onClick={() => setSettings(s => ({ ...s, duration: 5 }))} className={`py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors ${settings.duration === 5 ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><ClockIcon className="w-4 h-4"/>5s</button>
                            <button onClick={() => setSettings(s => ({ ...s, duration: 10 }))} className={`py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors ${settings.duration === 10 ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><ClockIcon className="w-4 h-4"/>10s</button>
                         </div>
                         <button className={`w-full py-1.5 rounded-md text-sm bg-purple-600 text-white cursor-not-allowed opacity-75`}>1080P</button>
                    </Card>
                    <Card>
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-white">Remove watermark</h3>
                            <button onClick={() => setSettings(s => ({ ...s, removeWatermark: !s.removeWatermark }))} className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${settings.removeWatermark ? 'bg-purple-600 justify-end' : 'bg-gray-600 justify-start'}`}>
                                <span className={`w-4 h-4 bg-white rounded-full transition-transform transform`}></span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="mt-2 sticky bottom-0">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    aria-label={isGenerating ? 'Video generation in progress' : 'Generate video'}
                >
                    {isGenerating && <SpinnerIcon className="w-5 h-5 animate-spin" />}
                    {isGenerating ? 'Generating Video...' : 'Generate Video'}
                </button>
            </div>
        </div>
    );
};
