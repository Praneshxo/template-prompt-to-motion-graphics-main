import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { BehindTheScenesTemplateProps } from '../types';

export const BehindTheScenesTemplate: React.FC<BehindTheScenesTemplateProps> = ({ heading, description, visuals }) => {
  const frame = useCurrentFrame();
  const {durationInFrames } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const textTranslateY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });

  // Distribute clips evenly throughout the duration
  const clipDuration = durationInFrames / visuals.behindTheScenesClips.length;

  return (
    <AbsoluteFill className="flex flex-row items-center justify-center bg-gray-950 text-white p-20 gap-20">
  {/* Left: Heading & Description */}
  <div className="flex-1 max-w-3xl">
    <div style={{ opacity: textOpacity, transform: `translateY(${textTranslateY}px)` }}>
      <h2 className="text-6xl font-bold mb-6">{heading}</h2>
      <p className="text-3xl font-light text-gray-300">{description}</p>
    </div>
  </div>

  {/* Right: Behind the Scenes Images */}
  {/* Right: Behind the Scenes Images */}
<div className="flex-1 flex flex-col items-center justify-center gap-28">
  {visuals.behindTheScenesClips.map((clip, index) => {
    const clipStartFrame = index * clipDuration;
    const clipEndFrame = clipStartFrame + clipDuration;
    const halfDuration = clipDuration / 2;
    const fadeDuration = Math.min(30, halfDuration * 0.99);

    const clipOpacity = interpolate(
      frame,
      [
        clipStartFrame,
        clipStartFrame + fadeDuration,
        clipEndFrame - fadeDuration,
        clipEndFrame,
      ],
      [0, 1, 1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    return (
      <Sequence
        key={index}
        from={clipStartFrame}
        durationInFrames={clipDuration}
      >
        <div className="flex-1 flex justify-center items-center gap-20 pl-70 ml-100">
          <Img
            src={staticFile(clip)}
            alt={`Clip ${index + 1}`}
            className="rounded-xl shadow-2xl border-4 border-gray-700"
            style={{ opacity: clipOpacity, width: '880px', height: 'auto' }}
          />
        </div>
      </Sequence>
    );
  })}
</div>
</AbsoluteFill>

  );
};
