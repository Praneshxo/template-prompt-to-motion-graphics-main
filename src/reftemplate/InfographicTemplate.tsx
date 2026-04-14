import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { InfographicTemplateProps } from '../types';

export const InfographicTemplate: React.FC<InfographicTemplateProps> = ({ title, infographicItems }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -80, to: 0 });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-gradient-to-tr from-green-500 to-teal-600 p-20">
      <h2 className="text-6xl font-extrabold text-white mb-20" style={{ transform: `translateY(${titleTranslateY}px)`, opacity: titleOpacity }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
        {infographicItems.map((item, index) => {
          const itemEnterFrame = index * 40 + 45;
          const itemScale = spring({ frame: frame - itemEnterFrame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 45, from: 0.5, to: 1 });
          const itemOpacity = interpolate(frame, [itemEnterFrame, itemEnterFrame + 30], [0, 1], { extrapolateRight: 'clamp' });

          

          return (
            <div key={index} className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg" style={{ transform: `scale(${itemScale})`, opacity: itemOpacity }}>
              
              <h3 className="text-4xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-2xl text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
