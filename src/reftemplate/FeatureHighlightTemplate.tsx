import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { FeatureHighlightTemplateProps } from '../types';

export const FeatureHighlightTemplate: React.FC<FeatureHighlightTemplateProps> = ({ heading, points, visual }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -80, to: 0 });
  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const visualScale = spring({ frame: frame - 20, fps, config: { damping: 100, stiffness: 80 }, from: 0.8, to: 1, durationInFrames: 60 });
  const visualOpacity = interpolate(frame, [20, 50], [0, 1]);

  return (
    <AbsoluteFill className="flex flex-row items-center justify-center bg-gray-900 text-white p-20 gap-20">
      <div className="flex-1 max-w-3xl">
        <h2
          className="text-6xl font-bold mb-16"
          style={{ transform: `translateY(${headingTranslateY}px)`, opacity: headingOpacity }}
        >
          {heading}
        </h2>
        <ul className="space-y-10">
          {points.map((point, index) => {
            const pointDelay = 40 + index * 25; // Stagger points
            const pointOpacity = interpolate(frame, [pointDelay, pointDelay + 30], [0, 1], { extrapolateRight: 'clamp' });
            const pointTranslateY = spring({ frame: frame - pointDelay, fps, from: 30, to: 0, durationInFrames: 30 });

            return (
              <li
                key={index}
                className="flex items-start text-4xl font-light leading-snug"
                style={{ opacity: pointOpacity, transform: `translateY(${pointTranslateY}px)` }}
              >
                <span className="text-green-400 text-5xl mr-6">✓</span>
                {point}
              </li>
            );
          })}
        </ul>
      </div>
      {visual && (
        <div className="flex-1 flex justify-center items-center">
          <Img
            src={staticFile(visual)}
            alt="AI workflow diagram"
            className="rounded-3xl shadow-2xl"
            style={{ transform: `scale(${visualScale})`, opacity: visualOpacity }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
