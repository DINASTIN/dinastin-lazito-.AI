
import React from 'react';
import { ChevronRightIcon } from './icons';

interface StatusPanelProps {
    isGenerating: boolean;
    generatedVideoUrl: string | null;
    statusMessage: string;
}

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-bold text-white">Crafting Your Vision...</h3>
        <p className="text-gray-400 mt-2 text-sm">{message}</p>
    </div>
);

const VideoPlaceholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <svg viewBox="0 0 100 100" className="w-32 h-32 text-gray-600">
            <path d="M96.4,53.2c-2.4-7.8-12.8-21.7-22-26.1c-1.3-0.6-2.6-1.2-4-1.7c-1.4-0.5-2.8-1-4.2-1.4c-0.6-0.2-1.2-0.4-1.8-0.5 c-3.5-0.9-7-0.9-10.4-0.1c-0.2,0-0.4,0.1-0.6,0.1c-1.4,0.3-2.8,0.7-4.1,1.2c-1.3,0.5-2.6,1-3.9,1.6c-5.3,2.4-10,6.1-13.8,10.6 C23.9,42,21,46.8,19,51.9c-0.5,1.2-0.9,2.4-1.3,3.7c-0.4,1.2-0.7,2.5-0.9,3.7c-0.2,1.3-0.4,2.6-0.4,3.9c-0.1,1.3-0.1,2.6-0.1,3.9 c0,1.3,0.1,2.6,0.2,3.9c0.1,1.3,0.3,2.6,0.6,3.9c0.2,1.3,0.5,2.6,0.9,3.8c0.4,1.3,0.8,2.5,1.3,3.7c0.9,2.4,2,4.7,3.3,6.8 c1.3,2.2,2.7,4.2,4.3,6.1c0.8,1,1.7,1.9,2.6,2.8c-2-0.6-4-1.5-5.9-2.7c-3.9-2.4-7.2-5.6-9.8-9.4c-2.6-3.8-4.4-8.1-5.3-12.8 C-0.1,60.6-0.5,55,0.4,49.4c0.9-5.6,2.8-10.9,5.7-15.6c2.9-4.7,6.7-8.7,11.2-11.9c4.5-3.2,9.7-5.5,15.2-6.7 c5.5-1.2,11.2-1.3,16.7-0.1c5.5,1.2,10.7,3.5,15.2,6.7c4.5,3.2,8.3,7.2,11.2,11.9c2.9,4.7,4.8,10,5.7,15.6 c0.9,5.6,0.5,11.2-1.2,16.5c-0.2,0.6-0.4,1.2-0.6,1.8c-0.2,0.6-0.5,1.2-0.8,1.8c-1.3,2.4-3.1,4.6-5.1,6.5c-2.1,1.9-4.5,3.4-7,4.4 c-0.6,0.2-1.2,0.5-1.8,0.7c0.8-1.5,1.5-3.1,2-4.7c0.5-1.6,1-3.3,1.3-5c0.1-0.6,0.3-1.2,0.4-1.8c0.1-0.6,0.3-1.2,0.4-1.8 c0.1-0.6,0.2-1.2,0.3-1.8c0.1-0.6,0.1-1.2,0.1-1.8c0-0.6,0-1.2,0-1.8c0-0.6,0-1.2,0-1.8c-0.1-0.6-0.1-1.2-0.2-1.8 c-0.1-0.6-0.2-1.2-0.3-1.8c-0.2-0.6-0.3-1.2-0.5-1.8c-0.2-0.6-0.4-1.2-0.6-1.8c-0.5-1.2-1-2.4-1.6-3.5c-0.6-1.2-1.3-2.3-2-3.4 c-1.4-2.2-3.1-4.2-5-5.9c-2-1.7-4.1-3.2-6.4-4.4c-1.2-0.6-2.4-1.1-3.6-1.5c-1.2-0.4-2.4-0.8-3.7-1c-1.2-0.3-2.5-0.5-3.7-0.6 c-2.5-0.2-5-0.2-7.4,0.3c-1.2,0.1-2.4,0.3-3.6,0.6c-1.2,0.3-2.4,0.6-3.5,1c-1.2,0.4-2.3,0.8-3.4,1.3c-1.1,0.5-2.2,1-3.3,1.6 c-2.2,1.2-4.2,2.7-6,4.4c-1.8,1.7-3.4,3.7-4.7,5.8c-1.3,2.1-2.4,4.4-3.2,6.8c-0.4,1.2-0.8,2.5-1.1,3.7c-0.3,1.3-0.6,2.6-0.8,3.9 c-0.2,1.3-0.4,2.6-0.5,3.9c-0.1,1.3-0.1,2.6-0.1,3.9c0,1.3,0.1,2.6,0.1,3.9c0.1,1.3,0.3,2.6,0.5,3.9c0.2,1.3,0.4,2.6,0.7,3.9 c0.3,1.3,0.7,2.5,1.1,3.8c1.6,4.9,4.2,9.3,7.6,12.8c3.4,3.5,7.7,6.2,12.5,7.7c1.2,0.4,2.5,0.7,3.7,0.9c1.3,0.2,2.5,0.4,3.8,0.5 c2.5,0.2,5,0.2,7.4-0.2c1.2-0.1,2.4-0.3,3.6-0.5c1.2-0.3,2.4-0.6,3.6-0.9c1.2-0.4,2.3-0.8,3.4-1.3c1.1-0.5,2.2-1,3.2-1.6 c2-1.2,3.9-2.7,5.6-4.4c1.7-1.7,3.2-3.7,4.4-5.8c0.6-1.1,1.2-2.2,1.7-3.3c0.5-1.1,1-2.3,1.4-3.4c0.4-1.1,0.8-2.3,1.1-3.4 c0.3-1.1,0.6-2.3,0.8-3.4c0.2-1.1,0.4-2.3,0.5-3.4c0.1-1.1,0.2-2.3,0.2-3.4C96.4,56.6,96.5,54.9,96.4,53.2z M88.9,46.2 c-0.5,0.9-1.3,1.5-2.2,1.8l-12.1,3.8c-0.9,0.3-1.6,1-1.9,1.9l-3.8,12.1c-0.3,0.9-1,1.6-1.9,1.9c-0.9,0.3-1.9,0-2.6-0.7l-9.6-9.6 c-0.5-0.5-1.1-0.8-1.8-0.8c-0.7,0-1.4,0.3-1.8,0.8l-9.6,9.6c-0.8,0.8-1.9,1-2.8,0.7c-0.9-0.3-1.6-1-1.9-1.9l-3.8-12.1 c-0.3-0.9-1-1.6-1.9-1.9L23.4,48c-0.9-0.3-1.6-1-1.9-1.9c-0.3-0.9,0-1.9,0.7-2.6l9.6-9.6c0.5-0.5,0.8-1.1,0.8-1.8 c0-0.7-0.3-1.4-0.8-1.8l-9.6-9.6c-0.8-0.8-1-1.9-0.7-2.8c0.3-0.9,1-1.6,1.9-1.9l12.1-3.8c0.9-0.3,1.9,0,2.6,0.7l9.6,9.6 c0.5,0.5,1.1,0.8,1.8,0.8s1.4-0.3,1.8-0.8l9.6-9.6c0.8-0.8,1.9-1,2.8-0.7c0.9,0.3,1.6,1,1.9,1.9l3.8,12.1c0.3,0.9,1,1.6,1.9,1.9 l12.1,3.8c0.9,0.3,1.6,1,1.9,1.9C89.9,44.3,89.6,45.4,88.9,46.2z"></path>
        </svg>

        <h3 className="text-xl font-bold text-white mt-4">VIDEO HERE!</h3>
        <p className="text-sm text-gray-400 mt-1">Ready to bring your image to life?</p>
        <p className="text-xs text-gray-500 mt-1">Configure your settings and click Generate.</p>
    </div>
);

export const StatusPanel: React.FC<StatusPanelProps> = ({ isGenerating, generatedVideoUrl, statusMessage }) => {
    
    const handleDownload = () => {
        if (!generatedVideoUrl) return;
        const a = document.createElement('a');
        a.href = generatedVideoUrl;
        a.download = `dinastin_ai_video_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bg-[#1e1e1e] rounded-lg p-3 flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-white">RealMotion Generation Status</h2>
            </div>
            <div className="flex justify-between items-center bg-[#2a2a2e] p-2 rounded-md mb-3">
                 <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Fast</span>
                 </div>
                 <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
            </div>
            <div className="bg-black rounded-md flex-grow">
                {isGenerating ? (
                    <LoadingIndicator message={statusMessage} />
                ) : generatedVideoUrl ? (
                    <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-md"></video>
                ) : (
                    <VideoPlaceholder />
                )}
            </div>
            {generatedVideoUrl && !isGenerating && (
                <div className="pt-3">
                    <button onClick={handleDownload} className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition-colors duration-200">
                        Download Video
                    </button>
                </div>
            )}
            <div className="text-xs text-gray-600 text-right pt-2">
                build: v0.0.48 (010323.2)
            </div>
        </div>
    );
};
