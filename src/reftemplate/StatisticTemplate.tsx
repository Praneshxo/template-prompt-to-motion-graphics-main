import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { StatisticTemplateProps } from '../types';

export const StatisticTemplate: React.FC<StatisticTemplateProps> = ({ statNumber, statLabel, description }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberScale = spring({ frame, fps, config: { damping: 200, stiffness: 100, mass: 1 }, durationInFrames: 60 });
  const numberOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  const textTranslateY = spring({ frame: frame - 30, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 45, from: 50, to: 0 });
  const textOpacity = interpolate(frame, [30, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-gradient-to-tl from-purple-700 to-pink-800 p-20">
      <div className="text-center">
        <h1 className="text-[12rem] font-extrabold text-white mb-8" style={{ transform: `scale(${numberScale})`, opacity: numberOpacity }}>
          {statNumber}
        </h1>
        <h2 className="text-7xl font-bold text-purple-200 mb-6" style={{ transform: `translateY(${textTranslateY}px)`, opacity: textOpacity }}>
          {statLabel}
        </h2>
        <p className="text-4xl text-purple-100 max-w-3xl mx-auto" style={{ transform: `translateY(${textTranslateY}px)`, opacity: textOpacity }}>
          {description}
        </p>
      </div>
    </AbsoluteFill>
  );
};
