// src/compositions/ErrorVideo.tsx
import React from 'react';

export const ErrorVideo: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-red-800 text-white text-4xl p-10 text-center">
      <div>
        <p>{message}</p>
        <p className="mt-4 text-2xl">
          Ensure your Express server is running on http://localhost:5000/nex
        </p>
      </div>
    </div>
  );
};
