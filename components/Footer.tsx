
import React from 'react';
import { DiscordIcon } from './icons';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#181818] border-t border-gray-700/50 px-6 py-2 text-xs text-gray-400">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span>©Digen 2025</span>
                    <a href="#" className="hover:text-white">Blog</a>
                    <a href="#" className="hover:text-white">Resources</a>
                    <a href="#" className="hover:text-white">Terms of Service</a>
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">About Us</a>
                </div>
                <a href="#" className="hover:text-white">
                    <DiscordIcon className="w-5 h-5" />
                </a>
            </div>
        </footer>
    );
};
