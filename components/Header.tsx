import React from 'react';
import { HomeIcon, VideoIcon, ImageIcon, SaveIcon, SearchIcon, UserIcon, GiftIcon } from './icons';
import type { AppView } from '../types';

interface HeaderProps {
    view: AppView;
    setView: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ view, setView }) => {
    return (
        <header className="bg-[#181818] border-b border-gray-700/50 px-6 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold tracking-wider text-white">DINASTIN.AI</h1>
                <nav className="flex items-center gap-2">
                    <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
                        <HomeIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setView('video')} className={`p-2 rounded-md flex items-center gap-2 transition-colors ${view === 'video' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        <VideoIcon className="w-5 h-5 text-white" />
                        <span className="text-white">Video</span>
                    </button>
                    <button onClick={() => setView('image')} className={`p-2 rounded-md flex items-center gap-2 transition-colors ${view === 'image' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        <ImageIcon className="w-5 h-5" />
                        <span>Image</span>
                    </button>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-3 py-1.5 rounded-md text-xs font-semibold">
                    <GiftIcon className="w-4 h-4" />
                    <span>Free</span>
                    <span className="bg-yellow-400 text-black rounded-full px-1.5 py-0.5 text-[10px] font-bold">0</span>
                </button>
                <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
                    <SaveIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
                    <SearchIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
                    <UserIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};
