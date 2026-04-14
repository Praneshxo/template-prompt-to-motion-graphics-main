import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BulletedListTemplateProps, BulletPoint } from '../types';

export const BulletedListTemplate: React.FC<BulletedListTemplateProps> = ({ heading, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -100, to: 0 });
  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-white p-20">
      <h2 className="text-6xl font-bold text-gray-800 mb-20" style={{ transform: `translateY(${headingTranslateY}px)`, opacity: headingOpacity }}>
        {heading}
      </h2>
      <div className="w-full max-w-4xl">
        {items.map((item: BulletPoint, index: number) => {
          const itemEnterFrame = index * 30 + 45;
          const itemOpacity = interpolate(frame, [itemEnterFrame, itemEnterFrame + 30], [0, 1], { extrapolateRight: 'clamp' });
          const itemTranslateY = spring({ frame: frame - itemEnterFrame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: 50, to: 0 });

          const renderVisual = () => {
            if (item.visuals?.image) {
            //   const imageUrl = `https://placehold.co/100x100/A0E7E2/000000?text=${encodeURIComponent(item.visuals.image.replace('.png', ''))}`;
            //   return <img src={imageUrl} alt={item.text} className="w-24 h-24 mr-6" style={{ transform: `translateY(${itemTranslateY}px)`, opacity: itemOpacity }} />;
            }
            return null;
          };

          return (
            <div key={index} className="flex items-center mb-8 p-6 bg-blue-50 rounded-lg shadow-sm" style={{ opacity: itemOpacity, transform: `translateY(${itemTranslateY}px)` }}>
              {renderVisual()}
              <p className="text-3xl text-gray-700 flex-1">{item.text}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
