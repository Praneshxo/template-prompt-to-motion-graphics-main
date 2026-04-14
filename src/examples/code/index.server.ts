// Server-safe exports - only metadata, no React components
// This file can be safely imported in API routes

export interface RemotionExample {
  id: string;
  name: string;
  description: string;
  code: string;
  durationInFrames: number;
  fps: number;
  category: "Text" | "Charts" | "Animation" | "3D" | "Other";
}

// Hardcoded code strings to avoid importing React components
// These are duplicated from the component files but necessary for server-side usage

const textRotationCode = `import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";

export const MyAnimation = () => {
  const frame = useCurrentFrame();

  // Text content - easily customizable
  const WORDS = ["This is a", "Text rotation example", "using Remotion!"];

  // Animation timing
  const WORD_DURATION = 60; // frames per word
  const FADE_IN_DURATION = 15;
  const FADE_OUT_START = 45;

  // Visual styling
  const FONT_SIZE = 120;
  const FONT_WEIGHT = "bold";
  const COLOR_TEXT = "#eee";
  const COLOR_BACKGROUND = "#1a1a2e";
  const BLUR_AMOUNT = 10;

  const currentWordIndex = Math.floor(frame / WORD_DURATION) % WORDS.length;
  const frameInWord = frame % WORD_DURATION;

  // Fade in/out animation
  const opacity = interpolate(
    frameInWord,
    [0, FADE_IN_DURATION, FADE_OUT_START, WORD_DURATION],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  // Scale animation
  const scale = interpolate(
    frameInWord,
    [0, FADE_IN_DURATION, FADE_OUT_START, WORD_DURATION],
    [0.8, 1, 1, 1.2],
    { extrapolateRight: "clamp" }
  );

  // Blur animation
  const blur = interpolate(
    frameInWord,
    [0, FADE_IN_DURATION, FADE_OUT_START, WORD_DURATION],
    [BLUR_AMOUNT, 0, 0, BLUR_AMOUNT],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR_BACKGROUND,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: FONT_SIZE,
          fontWeight: FONT_WEIGHT,
          color: COLOR_TEXT,
          opacity,
          transform: \`scale(\${scale})\`,
          filter: \`blur(\${blur}px)\`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {WORDS[currentWordIndex]}
      </h1>
    </AbsoluteFill>
  );
};`;

const chatMessagesCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const messages = [
    { text: "Hey! How are you?", isMe: false, delay: 0 },
    { text: "I'm good! Working on Remotion", isMe: true, delay: 45 },
    { text: "That's awesome! Show me!", isMe: false, delay: 90 },
    { text: "Check this out!", isMe: true, delay: 135 },
  ];

  const messageHeight = 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        padding: 60,
        justifyContent: "flex-end",
        paddingBottom: 80,
      }}
    >
      <div style={{ width: "100%", position: "relative" }}>
        {messages.map((msg, i) => {
          const progress = spring({
            frame: frame - msg.delay,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          if (frame < msg.delay) return null;

          const messagesAfter = messages.filter((m, idx) => idx > i && frame >= m.delay).length;
          const yOffset = messagesAfter * messageHeight;

          const xOffset = msg.isMe ? (1 - progress) * 100 : (1 - progress) * -100;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.isMe ? "flex-end" : "flex-start",
                marginBottom: 24,
                opacity: progress,
                transform: \`translateX(\${xOffset}px) translateY(\${-yOffset}px) scale(\${0.8 + progress * 0.2})\`,
              }}
            >
              <div
                style={{
                  backgroundColor: msg.isMe ? "#25D366" : "#2a2a2a",
                  color: "#fff",
                  padding: "20px 28px",
                  borderRadius: 24,
                  fontSize: 42,
                  fontFamily: "system-ui, sans-serif",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};`;

// Add minimal examples for the rest - these can be expanded later
const counterAnimationCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const targetNumber = 1000;
  const duration = 120;
  
  const currentNumber = Math.floor(
    interpolate(frame, [0, duration], [0, targetNumber], {
      extrapolateRight: "clamp",
    })
  );
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: "bold",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {currentNumber.toLocaleString()}
      </div>
    </AbsoluteFill>
  );
};`;

const histogramCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Rect } from "@remotion/shapes";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = [
    { label: "Mon", value: 65, color: "#6366f1" },
    { label: "Tue", value: 85, color: "#8b5cf6" },
    { label: "Wed", value: 45, color: "#a855f7" },
    { label: "Thu", value: 95, color: "#d946ef" },
    { label: "Fri", value: 75, color: "#ec4899" },
  ];

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 80;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "flex-end",
        padding: 60,
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 24,
          height: 400,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {data.map((item, i) => {
          const delay = i * 10;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          const height = Math.max(1, (item.value / maxValue) * 300 * progress);

          return (
            <div key={i} style={{ textAlign: "center", position: "relative" }}>
              <div style={{ position: "relative", height, width: barWidth }}>
                <Rect
                  width={barWidth}
                  height={height}
                  fill={item.color}
                  cornerRadius={12}
                  style={{ filter: \`drop-shadow(0 0 8px \${item.color}50)\` }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                    opacity: progress,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {Math.round(item.value * progress)}
                </span>
              </div>
              <div
                style={{
                  color: "#888",
                  fontSize: 16,
                  marginTop: 12,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};`;

const progressBarCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  
  const progress = interpolate(frame, [0, 120], [0, 100], {
    extrapolateRight: "clamp",
  });
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ width: "80%", maxWidth: 600 }}>
        <div
          style={{
            width: "100%",
            height: 40,
            backgroundColor: "#2a2a2a",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: \`\${progress}%\`,
              height: "100%",
              backgroundColor: "#6366f1",
              transition: "width 0.3s",
            }}
          />
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 32,
            marginTop: 20,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};`;

const animatedShapesCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Circle } from "@remotion/shapes";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Circle
        radius={100 * progress}
        fill="#6366f1"
        style={{ filter: "drop-shadow(0 0 20px #6366f150)" }}
      />
    </AbsoluteFill>
  );
};`;

const morphingHexagonsCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  
  const rotation = interpolate(frame, [0, 120], [0, 360]);
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#6366f1",
          transform: \`rotate(\${rotation}deg)\`,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
    </AbsoluteFill>
  );
};`;

const lottieAnimationCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Lottie } from "@remotion/lottie";
import { useState, useEffect } from "react";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("https://assets-v2.lottiefiles.com/a/73ecc94a-4ccb-4018-a710-835b9eaffeaf/OwGeQT8PCr.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie:", err));
  }, []);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  if (!animationData) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#94a3b8", fontSize: 24, fontFamily: "system-ui" }}>
          Loading animation...
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: \`scale(\${scale})\`,
          opacity,
        }}
      >
        <Lottie
          animationData={animationData}
          style={{ width: 400, height: 400 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 60,
          color: "#e2e8f0",
          fontSize: 24,
          fontFamily: "system-ui",
          opacity,
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 4 }}>Glowing Fish Loader</div>
        <div style={{ fontSize: 16, color: "#94a3b8" }}>by Mau Ali on LottieFiles</div>
      </div>
    </AbsoluteFill>
  );
};`;

const fallingSpheresCode = `import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
      }}
    >
      <ThreeCanvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh position={[0, frame * 0.01, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};`;

const ww1ExplainerCode = `import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const MyAnimation = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      {/* Scene 1: Title Card - 90 frames */}
      <Sequence from={0} durationInFrames={90}>
        <TitleCard title="World War 1" subtitle="The Great War (1914-1918)" />
      </Sequence>

      {/* Scene 2: Key Causes - 180 frames */}
      <Sequence from={90} durationInFrames={180}>
        <BulletList
          heading="Key Causes of WW1"
          items={[
            'Militarism and arms race',
            'Alliance systems across Europe',
            'Imperialism and colonial rivalries',
            'Nationalism and ethnic tensions',
            'Assassination of Archduke Franz Ferdinand'
          ]}
        />
      </Sequence>

      {/* Scene 3: Devastating Statistics - 120 frames */}
      <Sequence from={270} durationInFrames={120}>
        <Statistic
          statNumber="17M+"
          statLabel="Total Deaths"
          description="Over 17 million military and civilian casualties during the war"
        />
      </Sequence>

      {/* Scene 4: Major Battles - 180 frames */}
      <Sequence from={390} durationInFrames={180}>
        <Infographic
          title="Major Battles"
          items={[
            { title: 'Battle of the Somme', description: '1916' },
            { title: 'Battle of Verdun', description: '1916' },
            { title: 'Battle of Gallipoli', description: '1915' }
          ]}
        />
      </Sequence>

      {/* Scene 5: Before vs After - 180 frames */}
      <Sequence from={570} durationInFrames={180}>
        <Comparison
          heading="Impact of World War 1"
          comparisons={[
            { before: '4 major empires ruled Europe', after: 'Empires collapsed, new nations emerged' },
            { before: 'Traditional warfare tactics', after: 'Modern mechanized warfare' },
            { before: 'European dominance', after: 'Rise of USA as superpower' }
          ]}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// Title Card Component
const TitleCard = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 200, stiffness: 100, mass: 0.8 }, durationInFrames: 60 });
  const subtitleOpacity = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleTranslateY = interpolate(frame, [30, 90], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 80 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 112, fontWeight: 800, color: '#1a1a1a', marginBottom: 24, transform: \`scale(\${titleScale})\` }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 56, fontWeight: 300, color: '#4a5568', opacity: subtitleOpacity, transform: \`translateY(\${subtitleTranslateY}px)\` }}>
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Bullet List Component
const BulletList = ({ heading, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -100, to: 0 });
  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 80 }}>
      <h2 style={{ fontSize: 96, fontWeight: 700, color: '#2d3748', marginBottom: 80, transform: \`translateY(\${headingTranslateY}px)\`, opacity: headingOpacity }}>
        {heading}
      </h2>
      <div style={{ width: '100%', maxWidth: 1600 }}>
        {items.map((item, index) => {
          const itemEnterFrame = index * 30 + 45;
          const itemOpacity = interpolate(frame, [itemEnterFrame, itemEnterFrame + 30], [0, 1], { extrapolateRight: 'clamp' });
          const itemTranslateY = spring({ frame: frame - itemEnterFrame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: 50, to: 0 });

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 32, padding: 24, backgroundColor: '#ebf8ff', borderRadius: 12, opacity: itemOpacity, transform: \`translateY(\${itemTranslateY}px)\` }}>
              <p style={{ fontSize: 48, color: '#2d3748', flex: 1 }}>{item}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Statistic Component
const Statistic = ({ statNumber, statLabel, description }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberScale = spring({ frame, fps, config: { damping: 200, stiffness: 100, mass: 1 }, durationInFrames: 60 });
  const numberOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  const textTranslateY = spring({ frame: frame - 30, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 45, from: 50, to: 0 });
  const textOpacity = interpolate(frame, [30, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 80 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 192, fontWeight: 800, color: '#c53030', marginBottom: 32, transform: \`scale(\${numberScale})\`, opacity: numberOpacity }}>
          {statNumber}
        </h1>
        <h2 style={{ fontSize: 112, fontWeight: 700, color: '#2d3748', marginBottom: 24, transform: \`translateY(\${textTranslateY}px)\`, opacity: textOpacity }}>
          {statLabel}
        </h2>
        <p style={{ fontSize: 64, color: '#4a5568', maxWidth: 1200, margin: '0 auto', transform: \`translateY(\${textTranslateY}px)\`, opacity: textOpacity }}>
          {description}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Infographic Component
const Infographic = ({ title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -80, to: 0 });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 80 }}>
      <h2 style={{ fontSize: 96, fontWeight: 800, color: '#2d3748', marginBottom: 80, transform: \`translateY(\${titleTranslateY}px)\`, opacity: titleOpacity }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, width: '100%', maxWidth: 2400 }}>
        {items.map((item, index) => {
          const itemEnterFrame = index * 40 + 45;
          const itemScale = spring({ frame: frame - itemEnterFrame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 45, from: 0.5, to: 1 });
          const itemOpacity = interpolate(frame, [itemEnterFrame, itemEnterFrame + 30], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#f7fafc', padding: 32, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transform: \`scale(\${itemScale})\`, opacity: itemOpacity }}>
              <h3 style={{ fontSize: 64, fontWeight: 700, color: '#2d3748', marginBottom: 16 }}>{item.title}</h3>
              <p style={{ fontSize: 32, color: '#4a5568' }}>{item.description}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Comparison Component
const Comparison = ({ heading, comparisons }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingTranslateY = spring({ frame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: -80, to: 0 });
  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 80 }}>
      <h2 style={{ fontSize: 96, fontWeight: 700, color: '#2d3748', marginBottom: 80, transform: \`translateY(\${headingTranslateY}px)\`, opacity: headingOpacity }}>
        {heading}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, width: '100%', maxWidth: 2400, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 80, fontWeight: 800, color: '#c53030', marginBottom: 40 }}>Before</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 80, fontWeight: 800, color: '#38a169', marginBottom: 40 }}>After</h3>
        </div>
        {comparisons.map((item, index) => {
          const itemDelay = 40 + index * 40;
          const itemTranslateX = spring({ frame: frame - itemDelay, fps, from: -100, to: 0, durationInFrames: 45 });
          const itemOpacity = interpolate(frame, [itemDelay, itemDelay + 30], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <>
              <div key={\`before-\${index}\`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fed7d7', borderRadius: 24, transform: \`translateX(\${itemTranslateX}px)\`, opacity: itemOpacity }}>
                <p style={{ fontSize: 48, fontWeight: 600, color: '#742a2a' }}>{item.before}</p>
              </div>
              <div key={\`after-\${index}\`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#c6f6d5', borderRadius: 24, transform: \`translateX(\${itemTranslateX * -1}px)\`, opacity: itemOpacity }}>
                <p style={{ fontSize: 48, fontWeight: 600, color: '#22543d' }}>{item.after}</p>
              </div>
            </>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};`;

export const examples: RemotionExample[] = [
  {
    id: "text-rotation",
    name: "Text Rotation",
    description: "Rotating words with dissolve and blur effects",
    category: "Text",
    durationInFrames: 240,
    fps: 30,
    code: textRotationCode,
  },
  {
    id: "chat-messages",
    name: "Chat Messages",
    description: "WhatsApp-style bouncy message bubbles",
    category: "Text",
    durationInFrames: 180,
    fps: 30,
    code: chatMessagesCode,
  },
  {
    id: "counter-animation",
    name: "Counter Animation",
    description: "Animated number counter with smooth transitions",
    category: "Text",
    durationInFrames: 180,
    fps: 30,
    code: counterAnimationCode,
  },
  {
    id: "histogram",
    name: "Histogram",
    description: "Animated bar chart with smooth spring animations",
    category: "Charts",
    durationInFrames: 120,
    fps: 30,
    code: histogramCode,
  },
  {
    id: "progress-bar",
    name: "Progress Bar",
    description: "Smooth progress bar with percentage display",
    category: "Charts",
    durationInFrames: 180,
    fps: 30,
    code: progressBarCode,
  },
  {
    id: "animated-shapes",
    name: "Animated Shapes",
    description: "Geometric shapes with spring animations",
    category: "Animation",
    durationInFrames: 180,
    fps: 30,
    code: animatedShapesCode,
  },
  {
    id: "morphing-hexagons",
    name: "Morphing Hexagons",
    description: "Hexagons morphing and rotating in 3D space",
    category: "Animation",
    durationInFrames: 180,
    fps: 30,
    code: morphingHexagonsCode,
  },
  {
    id: "lottie-animation",
    name: "Lottie Fish Loader",
    description: "Glowing fish loader animation from LottieFiles",
    category: "Animation",
    durationInFrames: 180,
    fps: 60,
    code: lottieAnimationCode,
  },
  {
    id: "falling-spheres",
    name: "Falling Spheres",
    description: "3D spheres falling with physics simulation",
    category: "3D",
    durationInFrames: 180,
    fps: 30,
    code: fallingSpheresCode,
  },
  {
    id: "ww1-explainer",
    name: "World War 1 Explainer",
    description: "Educational video about World War 1 with white background",
    category: "Other",
    durationInFrames: 750,
    fps: 30,
    code: ww1ExplainerCode,
  },
];

export function getExampleById(id: string): RemotionExample | undefined {
  return examples.find((e) => e.id === id);
}

export function getExamplesByCategory(
  category: RemotionExample["category"],
): RemotionExample[] {
  return examples.filter((e) => e.category === category);
}
