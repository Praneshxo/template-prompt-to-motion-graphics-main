import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface TitleCardProps {
  title: string;
  subtitle?: string;
}

export const TitleCardTemplate: React.FC<TitleCardProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 200, stiffness: 100, mass: 0.8 }, durationInFrames: 60 });
  const subtitleOpacity = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleTranslateY = interpolate(frame, [30, 90], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-20">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-white mb-6" style={{ transform: `scale(${titleScale})` }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-4xl font-light text-blue-200" style={{ opacity: subtitleOpacity, transform: `translateY(${subtitleTranslateY}px)` }}>
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
