export interface VideoSettings {
    duration: 5 | 10;
    resolution: '1080p';
    removeWatermark: boolean;
    actMotionModel: string | null;
    effectModel: string | null;
    audioTrack: string | null;
}

export interface Model {
    name: string;
    imageUrl: string;
}

export type AppView = 'video' | 'image';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
