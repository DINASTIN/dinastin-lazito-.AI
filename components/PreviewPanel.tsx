
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, LibraryIcon, CloseIcon } from './icons';

interface PreviewPanelProps {
    image: File | null;
    setImage: (file: File | null) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ image, setImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(true);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setShowTooltip(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleClearImage = useCallback(() => {
        setImage(null);
        if(imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [imageUrl, setImage]);

    return (
        <div className="bg-[#1e1e1e] rounded-lg p-2 flex-grow flex flex-col relative h-full">
            <div className="aspect-[9/16] bg-black rounded-md flex items-center justify-center relative overflow-hidden">
                {imageUrl ? (
                    <>
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                         <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 p-1 rounded-md text-xs">
                             <span className="w-4 h-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                             </span>
                             <span>9:16</span>
                        </div>
                        <button onClick={handleClearImage} aria-label="Remove image" className="absolute top-2 left-2 bg-black/50 p-1 rounded-full hover:bg-red-500/80 transition-colors">
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Image Preview</p>
                )}
            </div>

             {showTooltip && !imageUrl && (
                 <div className="absolute bottom-24 left-4 right-4 bg-[#2a2a2e] border border-gray-600 rounded-lg p-3 text-sm text-gray-300 shadow-lg z-10">
                    <button onClick={() => setShowTooltip(false)} aria-label="Close tooltip" className="absolute top-1 right-1 text-gray-400 hover:text-white">
                        <CloseIcon className="w-4 h-4"/>
                    </button>
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2a2a2e] border-b border-r border-gray-600 transform rotate-45"></div>
                    <p className="font-bold">Upload a photo to start!</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Bring your ideas to life. Create stunning short videos from a single image.
                    </p>
                </div>
             )}

            <div className="mt-auto p-2 flex items-center justify-center gap-4">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    aria-hidden="true"
                />
                <button onClick={handleUploadClick} className="flex items-center gap-2 px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                    <UploadIcon className="w-5 h-5"/>
                    <span>Upload</span>
                </button>
                 <button 
                    onClick={() => alert('Feature coming soon: Import from your media library.')}
                    className="flex items-center gap-2 px-6 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                    <LibraryIcon className="w-5 h-5"/>
                </button>
            </div>
            {/* Timeline Placeholder */}
            <div className="h-16 bg-[#121212] rounded-md mt-2 flex items-center justify-between p-2">
                 <div className="w-16 h-12 bg-gray-700 rounded-md overflow-hidden">
                    {imageUrl && <img src={imageUrl} alt="Timeline thumbnail" className="w-full h-full object-cover"/>}
                </div>
                <div className="w-4 h-12 bg-gray-500 rounded-full cursor-pointer"></div>
                <button className="px-4 py-2 bg-gray-700 rounded-md text-sm">+ End</button>
            </div>
        </div>
    );
};
