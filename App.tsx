
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { ActionButton } from './components/ActionButton';
import { Spinner } from './components/Spinner';
import { processImageWithGemini } from './services/geminiService';
import type { ProcessMode } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ProcessMode | null>(null);

  const handleImageUpload = (file: File, base64: string) => {
    resetState();
    setOriginalFile(file);
    setOriginalImage(base64);
  };
  
  const resetState = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setOriginalFile(null);
    setIsLoading(false);
    setError(null);
    setActiveTool(null);
  }

  const handleProcessing = useCallback(async (mode: ProcessMode) => {
    if (!originalFile || !originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setProcessedImage(null);
    setError(null);
    setActiveTool(mode);

    try {
      // FIX: The 'File' object has a 'type' property for the mimeType, not 'mimeType'.
      const mimeType = originalFile.type;
      const base64Data = originalImage.split(',')[1];
      
      const resultBase64 = await processImageWithGemini(base64Data, mimeType, mode);
      setProcessedImage(`data:${mimeType};base64,${resultBase64}`);

    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveTool(null);
    }
  }, [originalFile, originalImage]);
  
  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    const fileExtension = originalFile?.name.split('.').pop() || 'png';
    link.download = `processed_image_${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          AI Image Enhancer & BG Remover
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Transform your images with the power of Gemini
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        {!originalImage && <ImageUploader onImageUpload={handleImageUpload} />}

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4 w-full text-center" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {originalImage && (
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ImageDisplay title="Original" imageSrc={originalImage} />
              <ImageDisplay title="Processed" imageSrc={processedImage}>
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-800/80 flex flex-col justify-center items-center rounded-lg backdrop-blur-sm">
                      <Spinner />
                      <p className="mt-4 text-lg font-semibold text-gray-200">
                        {activeTool === 'removeBg' ? 'Removing Background...' : 'Enhancing Quality...'}
                      </p>
                    </div>
                  )}
              </ImageDisplay>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col sm:flex-row justify-center items-center gap-4">
              <ActionButton 
                onClick={() => handleProcessing('removeBg')}
                disabled={isLoading}
                iconClass="fa-solid fa-wand-magic-sparkles"
              >
                Remove Background
              </ActionButton>
              <ActionButton 
                onClick={() => handleProcessing('enhance')}
                disabled={isLoading}
                iconClass="fa-solid fa-star"
              >
                Enhance Quality
              </ActionButton>
               {processedImage && !isLoading && (
                 <ActionButton 
                    onClick={handleDownload}
                    iconClass="fa-solid fa-download"
                    className="bg-green-600 hover:bg-green-700"
                  >
                  Download
                </ActionButton>
               )}
              <ActionButton 
                onClick={resetState}
                disabled={isLoading}
                iconClass="fa-solid fa-arrow-rotate-left"
                className="bg-gray-600 hover:bg-gray-700"
              >
                Reset
              </ActionButton>
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-auto pt-8">
        <p className="text-gray-500">Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;