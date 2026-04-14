import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ComparisonTemplateProps } from '../types';

export const ComparisonTemplate: React.FC<ComparisonTemplateProps> = ({ heading, comparisons }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -80, to: 0 });
  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-indigo-900 text-white p-20">
      <h2
        className="text-6xl font-bold mb-20"
        style={{ transform: `translateY(${headingTranslateY}px)`, opacity: headingOpacity }}
      >
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-10 w-full max-w-6xl text-center">
        <div className="flex flex-col items-center">
          <h3 className="text-5xl font-extrabold text-red-400 mb-10">Challenge</h3>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-5xl font-extrabold text-green-400 mb-10">Solution</h3>
        </div>
        {comparisons.map((item, index) => {
          const itemDelay = 40 + index * 40;
          const itemTranslateX = spring({ frame: frame - itemDelay, fps, from: -100, to: 0, durationInFrames: 45 });
          const itemOpacity = interpolate(frame, [itemDelay, itemDelay + 30], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <React.Fragment key={index}>
              <div
                className="flex items-center justify-center p-8 bg-red-900/50 rounded-2xl shadow-lg"
                style={{ transform: `translateX(${itemTranslateX}px)`, opacity: itemOpacity }}
              >
                <p className="text-4xl font-semibold">{item.challenge}</p>
              </div>
              <div
                className="flex items-center justify-center p-8 bg-green-900/50 rounded-2xl shadow-lg"
                style={{ transform: `translateX(${itemTranslateX * -1}px)`, opacity: itemOpacity }}
              >
                <p className="text-4xl font-semibold">{item.solution}</p>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
