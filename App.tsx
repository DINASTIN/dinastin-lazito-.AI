import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PreviewPanel } from './components/PreviewPanel';
import { ControlPanel } from './components/ControlPanel';
import { StatusPanel } from './components/StatusPanel';
import { Footer } from './components/Footer';
import { ImageGenerationView } from './components/ImageGenerationView';
import { generateVideo } from './services/geminiService';
import type { VideoSettings, AppView } from './types';

const App: React.FC = () => {
    // State for view mode
    const [view, setView] = useState<AppView>('video');

    // State for Video Generation
    const [image, setImage] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [settings, setSettings] = useState<VideoSettings>({
        duration: 5,
        resolution: '1080p',
        removeWatermark: false,
        actMotionModel: null,
        effectModel: 'Uplifting', // Default selected effect model
        audioTrack: null,
    });
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Waiting to start video creation');
    
    // Global Error State
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt) {
            setError('Please enter a video prompt.');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedVideoUrl(null);

        // Construct a more detailed prompt from settings for better generation results
        let fullPrompt = prompt;
        if (settings.effectModel) {
            fullPrompt += ` with a style of ${settings.effectModel}`;
        }
        if (settings.actMotionModel) {
            fullPrompt += `, featuring a character resembling ${settings.actMotionModel}`;
        }
        if (settings.audioTrack) {
            fullPrompt += `. The video should have a mood that fits ${settings.audioTrack} music.`;
        }
        fullPrompt += ` The video should be ${settings.duration} seconds long.`;


        try {
            const videoUrl = await generateVideo(image, fullPrompt, setStatusMessage);
            setGeneratedVideoUrl(videoUrl);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
        } finally {
            setIsGenerating(false);
            setStatusMessage('Waiting to start video creation');
        }
    }, [image, prompt, settings]);

    return (
        <div className="bg-[#121212] text-gray-300 min-h-screen flex flex-col font-sans">
            <Header view={view} setView={setView} />

            {view === 'video' ? (
                <main className="flex-grow flex p-4 gap-4 overflow-hidden">
                    <div className="w-1/4 flex flex-col gap-4">
                        <PreviewPanel image={image} setImage={setImage} />
                    </div>
                    <div className="w-1/2 flex flex-col gap-4">
                        <ControlPanel
                            prompt={prompt}
                            setPrompt={setPrompt}
                            settings={settings}
                            setSettings={setSettings}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                            setError={setError}
                        />
                    </div>
                    <div className="w-1/4 flex flex-col">
                        <StatusPanel
                            isGenerating={isGenerating}
                            generatedVideoUrl={generatedVideoUrl}
                            statusMessage={statusMessage}
                        />
                    </div>
                </main>
            ) : (
                <ImageGenerationView setGlobalError={setError} />
            )}

            <Footer />
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-800 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="absolute top-2 right-2 text-xl">&times;</button>
                </div>
            )}
        </div>
    );
};

export default App;
