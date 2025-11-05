
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUpload(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-blue-400', 'bg-gray-700/50');
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-400', 'bg-gray-700/50');
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-400', 'bg-gray-700/50');
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);


  return (
    <div className="w-full max-w-lg mx-auto">
        <label 
            htmlFor="file-upload" 
            className="relative block w-full h-64 rounded-lg border-2 border-dashed border-gray-600 p-6 text-center cursor-pointer hover:border-gray-500 transition-colors duration-300 ease-in-out"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="flex flex-col items-center justify-center h-full">
                <i className="fa-solid fa-cloud-arrow-up text-5xl text-gray-400"></i>
                <span className="mt-4 block text-lg font-semibold text-gray-300">
                    Drag & drop an image or click to upload
                </span>
                <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
            </div>
            <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept="image/*"
                onChange={handleFileChange} 
            />
        </label>
    </div>
  );
};
