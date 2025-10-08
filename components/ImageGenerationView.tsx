import React, { useState } from 'react';
import { improvePrompt, generateImage } from '../services/geminiService';
import type { AspectRatio } from '../types';
import { WandIcon, SpinnerIcon, DownloadIcon, ImageIcon as ImageIconPlaceholder, CloseIcon } from './icons';

const aspectRatios: { label: string; value: AspectRatio }[] = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Portrait (9:16)', value: '9:16' },
    { label: 'Landscape (16:9)', value: '16:9' },
    { label: 'Standard (4:3)', value: '4:3' },
    { label: 'Classic (3:4)', value: '3:4' },
];

interface ImageGenerationViewProps {
    setGlobalError: (error: string | null) => void;
}

export const ImageGenerationView: React.FC<ImageGenerationViewProps> = ({ setGlobalError }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isImproving, setIsImproving] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    const handleImprovePrompt = async () => {
        if (!prompt) {
            setGlobalError("Please enter a prompt to improve.");
            return;
        }
        setIsImproving(true);
        setGlobalError(null);
        try {
            const improved = await improvePrompt(prompt);
            setPrompt(improved);
        } catch (err) {
            setGlobalError(err instanceof Error ? err.message : "An unknown error occurred while improving prompt.");
        } finally {
            setIsImproving(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!prompt) {
            setGlobalError("Please enter a prompt to generate an image.");
            return;
        }
        setIsGenerating(true);
        setGlobalError(null);
        setGeneratedImageUrl(null);
        try {
            const imageUrl = await generateImage(prompt, aspectRatio);
            setGeneratedImageUrl(imageUrl);
        } catch (err) {
            setGlobalError(err instanceof Error ? err.message : "An unknown error occurred during image generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadImage = () => {
        if (!generatedImageUrl) return;
        const a = document.createElement('a');
        a.href = generatedImageUrl;
        a.download = `dinastin_ai_image_${Date.now()}.jpeg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <main className="flex-grow flex p-4 gap-4 overflow-hidden">
            {/* Control Panel (left) */}
            <div className="w-[30%] max-w-md flex flex-col gap-4 bg-[#1e1e1e] p-4 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-2">Image Generation Studio</h2>
                
                <div className="flex flex-col gap-4 flex-grow overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f4f4f #1e1e1e' }}>
                    {/* Prompt Section */}
                    <div className="bg-[#2a2a2e] border border-gray-700/80 rounded-lg p-4">
                         <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-white">Image Prompt</h3>
                             <button onClick={handleImprovePrompt} disabled={isImproving} className="text-sm flex items-center gap-1.5 bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-wait">
                                {isImproving ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <WandIcon className="w-4 h-4 text-purple-400" />}
                                <span>{isImproving ? 'Improving...' : 'Improve'}</span>
                            </button>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A majestic lion with a glowing mane, standing on a cliff overlooking a futuristic city at sunset, cinematic lighting..."
                            className="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-md p-2 text-sm placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
                            maxLength={1500}
                        />
                         <p className="text-right text-xs text-gray-500 mt-1">{prompt.length}/1500</p>
                    </div>

                    {/* Aspect Ratio Section */}
                    <div className="bg-[#2a2a2e] border border-gray-700/80 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">Aspect Ratio</h3>
                        <div className="grid grid-cols-1 gap-2">
                           {aspectRatios.map(ratio => (
                               <button 
                                   key={ratio.value}
                                   onClick={() => setAspectRatio(ratio.value)}
                                   className={`w-full text-left p-2 rounded-md text-sm transition-colors ${aspectRatio === ratio.value ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                               >
                                   {ratio.label}
                               </button>
                           ))}
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-auto pt-2">
                     <button
                        onClick={handleGenerateImage}
                        disabled={isGenerating}
                        className="w-full py-3 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                        aria-label={isGenerating ? 'Image generation in progress' : 'Generate image'}
                    >
                        {isGenerating && <SpinnerIcon className="w-5 h-5 animate-spin" />}
                        {isGenerating ? 'Generating Image...' : 'Generate Image'}
                    </button>
                </div>
            </div>

            {/* Display Panel (right) */}
            <div className="flex-grow bg-[#1e1e1e] rounded-lg p-3 flex flex-col">
                <div className="bg-black rounded-md flex-grow flex items-center justify-center relative overflow-hidden">
                    {isGenerating && (
                         <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h3 className="text-lg font-bold text-white">Conjuring Pixels...</h3>
                            <p className="text-gray-400 mt-2 text-sm">The AI is painting your masterpiece.</p>
                        </div>
                    )}
                    {!isGenerating && generatedImageUrl && (
                        <>
                            <img src={generatedImageUrl} alt="Generated by AI" className="w-full h-full object-contain" />
                            <button onClick={() => setGeneratedImageUrl(null)} aria-label="Clear image" className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full hover:bg-red-500/80 transition-colors">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    {!isGenerating && !generatedImageUrl && (
                         <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-500">
                             <ImageIconPlaceholder className="w-24 h-24 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">Image Display</h3>
                            <p className="text-sm mt-1">Your generated image will appear here.</p>
                        </div>
                    )}
                </div>
                 {generatedImageUrl && !isGenerating && (
                    <div className="pt-3 flex justify-end">
                        <button onClick={handleDownloadImage} className="flex items-center gap-2 px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors duration-200">
                            <DownloadIcon className="w-5 h-5"/>
                            <span>Download</span>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};
