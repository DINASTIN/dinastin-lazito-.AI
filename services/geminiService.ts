import { GoogleGenAI } from "@google/genai";
import type { AspectRatio } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    return {
        imageBytes: base64EncodedData,
        mimeType: file.type,
    };
};

const loadingMessages = [
    "Warming up the AI generators...",
    "Analyzing the source image for cinematic potential...",
    "Composing the initial scene and lighting...",
    "Storyboarding the motion and camera angles...",
    "Rendering high-fidelity frames...",
    "Applying advanced cinematic effects and color grading...",
    "Synchronizing audio and visual elements...",
    "Finalizing the video render, adding finishing touches...",
];

export const improvePrompt = async (prompt: string): Promise<string> => {
    if (!prompt.trim()) {
        return "";
    }
    const modelTarget = prompt.length > 500 ? 'text-to-image' : 'text-to-video';
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert prompt engineer for a generative AI model. Your task is to take a user's simple prompt and expand it into a rich, cinematic, and descriptive prompt that will generate a beautiful and engaging result.
      - Focus on visual details: describe the scene, lighting, colors, camera angles (e.g., wide shot, close-up, dolly zoom), and motion if for video.
      - Evoke a mood or atmosphere.
      - Mention artistic styles (e.g., photorealistic, impressionistic, futuristic).
      - For a ${modelTarget} model.
      - Keep it concise but powerful.
      - Return ONLY the improved prompt text, without any introductory phrases like "Here's the improved prompt:" or any other surrounding text.

      Original user prompt: "${prompt}"`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error improving prompt:", error);
        throw new Error("Could not improve the prompt. The AI service may be temporarily unavailable.");
    }
};

export const generateImage = async (
    prompt: string,
    aspectRatio: AspectRatio
): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Image generation succeeded but returned no images.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};


export const generateVideo = async (
    image: File,
    prompt: string,
    setStatusMessage: (message: string) => void
): Promise<string> => {
    try {
        setStatusMessage(loadingMessages[0]);
        const imagePart = await fileToGenerativePart(image);
        
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: imagePart,
            config: {
                numberOfVideos: 1
            }
        });

        let messageIndex = 1;
        const interval = setInterval(() => {
            setStatusMessage(loadingMessages[messageIndex % loadingMessages.length]);
            messageIndex++;
        }, 7000); // Change message every 7 seconds

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        clearInterval(interval);
        setStatusMessage("Video generated successfully!");

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }
        
        const response = await fetch(`${downloadLink}&key=${API_KEY}`);
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to download video: ${response.statusText}. Details: ${errorBody}`);
        }
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};
