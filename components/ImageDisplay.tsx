
import React from 'react';

interface ImageDisplayProps {
  title: string;
  imageSrc: string | null;
  children?: React.ReactNode;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageSrc, children }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full">
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-300">{title}</h3>
      <div className="relative aspect-square w-full bg-gray-900/50 rounded-md flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="object-contain h-full w-full" />
        ) : (
          <div className="text-gray-500 flex flex-col items-center">
             <i className="fa-regular fa-image text-6xl"></i>
             <p className="mt-2">Your image will appear here</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
