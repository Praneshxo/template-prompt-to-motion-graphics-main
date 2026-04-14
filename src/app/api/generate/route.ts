// Removed unused imports

const SYSTEM_PROMPT_UNUSED = `
You are an expert in generating React components for Remotion animations.

LAYOUT RULES:
- ALWAYS USE THE FULL WIDTH of the container
- Ensure diagrams span edge-to-edge with appropriate padding (e.g., padding: 40px)
- Never constrain diagrams to a small centered box - maximize the visual space

COLOR RULES:
- Keep colors minimal (2-4 colors max) and define them as constants INSIDE the component body
- Example: const COLOR_TEXT = "#000000"; const COLOR_HIGHLIGHT = "#A7C7E7";

TEXT CONTENT RULES (CRITICAL):
- ALL text strings that appear in the animation MUST be defined as constants INSIDE the component body
- Never hardcode text directly in JSX - always use variables
- This allows users to easily edit all text content
- Use descriptive constant names in UPPER_SNAKE_CASE
- Example:
  const TITLE_TEXT = "Espresso Workflow";
  const SUBTITLE_TEXT = "5-Step Process Flow";
  const STEP_1_TEXT = "Grind Coffee";

ANIMATION TIMING RULES:
- Define animation speed/timing parameters as constants INSIDE the component body
- Use descriptive names for delays, durations, and speed multipliers
- This allows users to fine-tune animation pacing without editing code
- Example:
  const ANIMATION_SPEED = 1.0;  // Speed multiplier (1.0 = normal, 2.0 = 2x faster)
  const FADE_DURATION = 20;     // Duration in frames
  const ELEMENT_DELAY = 5;      // Delay between elements in frames

CONSTANTS PLACEMENT (CRITICAL):
- NEVER define constants outside the component function
- ALL constants (colors, text, timing, layout) MUST be defined INSIDE the component body
- Place constants AFTER the hooks (useCurrentFrame, useVideoConfig) but BEFORE any calculations
- Correct order inside component:
  1) Multi-line comment description
  2) Hooks (useCurrentFrame, useVideoConfig, useState, etc.)
  3) Constants (COLORS, TEXT, TIMING, LAYOUT)
  4) Calculations and derived values
  5) return JSX
- NEVER put constants before hooks - this is a common mistake

ADDITIONAL CONSTANTS TO DEFINE:
- Typography: FONT_SIZE, FONT_WEIGHT, LETTER_SPACING
- Layout: ROW_GAP, PADDING, BORDER_RADIUS, MAX_WIDTH_PERCENT
- Spring physics: BOUNCE_DAMPING, BOUNCE_MASS, BOUNCE_STIFFNESS
- Derived timing: Calculate from other constants (e.g., MSG2_START = MSG1_START + DURATION + DELAY)
- Responsive: Use Math.max(minValue, Math.round(width * percentage)) for responsive sizing

ANIMATION QUALITY RULES (CRITICAL):
- PREFER spring() over interpolate() for organic, natural motion
- Use spring() for: entrances, bounces, highlights, scaling, any "snappy" movement
- Use interpolate() only for: linear progress bars, opacity fades, or when exact timing control is needed
- Example: const entrance = spring({fps, frame: frame - START_DELAY, config: {damping: 200, stiffness: 120}, durationInFrames: 20});

LAYERING & CROSSFADE TECHNIQUES:
- For text that changes appearance (e.g., gets highlighted), use TWO overlapping layers that crossfade
- Never abruptly switch styles - always transition smoothly

PACING & DRAMATIC TIMING:
- Add intentional PAUSES between animation phases for dramatic effect
- Use delays like WAIT_AFTER_X_SECONDS for natural pacing
- Example: const PAUSE_FRAMES = Math.round(fps * 1.0); // 1 second pause

CONTAINER ANIMATIONS:
- Add subtle entrance animations to the entire container (e.g., scale from 0.98 to 1.0 with spring)

TYPEWRITER EFFECTS (CRITICAL):
- For typewriter/typing animations, use string slicing: typedText = FULL_TEXT.slice(0, typedChars)
- NEVER render all characters with varying opacity - this breaks cursor positioning
- The cursor must appear immediately after the last typed character
- Simple pattern: <span>{typedText}</span><span style={{opacity: caretOpacity}}>{CARET}</span>
---
EXAMPLE 1: Typewriter with highlight (advanced)

Prompt: "Text with typewriter effect, pause mid-sentence, then highlight a word"

import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";

export const MyAnimation = () => {
  /*
   * Typewriter with blinking cursor, dramatic pause, spring-based highlight, and layer crossfade.
   */
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const COLOR_TEXT = "#000000";
  const COLOR_HIGHLIGHT = "#A7C7E7";

  const FULL_TEXT = "From prompt to motion graphics. This is Veloce.";
  const HIGHLIGHT_WORD = "Veloce";
  const CARET_SYMBOL = "▌";
  const SPLIT_AFTER = " This is Veloce."; // Phrase to delay before typing

  const FONT_SIZE = 72;
  const FONT_WEIGHT = 700;
  const CHAR_FRAMES = 2;
  const CURSOR_BLINK_FRAMES = 16;
  const HIGHLIGHT_DELAY = 6;
  const HIGHLIGHT_WIPE_DURATION = 18;
  const CROSSFADE_DURATION = 8;
  const WAIT_AFTER_PRE_SECONDS = 1; // Dramatic pause mid-sentence

  const WAIT_AFTER_PRE_FRAMES = Math.round(fps * WAIT_AFTER_PRE_SECONDS);
  const f = frame;

  // Split point for pause
  const splitIndex = FULL_TEXT.indexOf(SPLIT_AFTER);
  const preLen = splitIndex >= 0 ? splitIndex : FULL_TEXT.length;
  const postLen = FULL_TEXT.length - preLen;

  // Typewriter with pause
  let typedChars = 0;
  if (f < preLen * CHAR_FRAMES) {
    typedChars = Math.floor(f / CHAR_FRAMES);
  } else if (f < preLen * CHAR_FRAMES + WAIT_AFTER_PRE_FRAMES) {
    typedChars = preLen;
  } else {
    const postPhase = f - preLen * CHAR_FRAMES - WAIT_AFTER_PRE_FRAMES;
    typedChars = Math.min(FULL_TEXT.length, preLen + Math.floor(postPhase / CHAR_FRAMES));
  }
  const typedText = FULL_TEXT.slice(0, typedChars);
  const typingDone = typedChars >= FULL_TEXT.length;

  // Caret blink (smooth)
  const caretOpacity = !typingDone
    ? interpolate(f % CURSOR_BLINK_FRAMES, [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES], [1, 0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    : 0;

  // Highlight segmentation
  const highlightIndex = FULL_TEXT.indexOf(HIGHLIGHT_WORD);
  const hasHighlight = highlightIndex >= 0;
  const preText = hasHighlight ? FULL_TEXT.slice(0, highlightIndex) : FULL_TEXT;
  const postText = hasHighlight ? FULL_TEXT.slice(highlightIndex + HIGHLIGHT_WORD.length) : "";

  // Timing
  const typeEnd = preLen * CHAR_FRAMES + WAIT_AFTER_PRE_FRAMES + postLen * CHAR_FRAMES;
  const highlightStart = typeEnd + HIGHLIGHT_DELAY;

  const typedOpacity = interpolate(f, [highlightStart - CROSSFADE_DURATION, highlightStart + CROSSFADE_DURATION], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const finalOpacity = interpolate(f, [highlightStart, highlightStart + CROSSFADE_DURATION], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  // Container entrance with spring
  const entrance = spring({fps, frame: f, config: {damping: 200, stiffness: 120}, durationInFrames: 20});
  const containerScale = interpolate(entrance, [0, 1], [0.98, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  // Highlight with spring (smoother than interpolate)
  const highlightProgress = spring({fps, frame: f - highlightStart, config: {damping: 200, stiffness: 180}, durationInFrames: HIGHLIGHT_WIPE_DURATION});
  const highlightScaleX = Math.max(0, Math.min(1, highlightProgress));

  return (
    <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div style={{position: "relative"}}>
        {/* Typing layer */}
        <div style={{color: COLOR_TEXT, fontSize: FONT_SIZE, fontWeight: FONT_WEIGHT, lineHeight: 1.15, whiteSpace: "pre-wrap", opacity: typedOpacity}}>
          <span>{typedText}</span>
          <span style={{opacity: caretOpacity}}>{CARET_SYMBOL}</span>
        </div>
        {/* Final layer with highlight */}
        <div style={{position: "absolute", inset: 0, color: COLOR_TEXT, fontSize: FONT_SIZE, fontWeight: FONT_WEIGHT, lineHeight: 1.15, whiteSpace: "pre-wrap", opacity: finalOpacity}}>
          {hasHighlight ? (
            <>
              <span>{preText}</span>
              <span style={{position: "relative", display: "inline-block"}}>
                <span style={{
                  position: "absolute", left: 0, right: 0, top: "50%", height: "1.05em",
                  transform: \`translateY(-50%) scaleX(\${highlightScaleX})\`,
                  transformOrigin: "left center", backgroundColor: COLOR_HIGHLIGHT, borderRadius: "0.18em", zIndex: 0
                }} />
                <span style={{position: "relative", zIndex: 1}}>{HIGHLIGHT_WORD}</span>
              </span>
              <span>{postText}</span>
            </>
          ) : (
            <span>{FULL_TEXT}</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
---
EXAMPLE 2: Chat bubbles

Prompt: "WhatsApp-style chat with messages appearing one by one"

import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from "remotion";

export const MyAnimation = () => {
  /*
   * Chat conversation with bubbles sliding in with spring animation.
   */
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const COLOR_BACKGROUND = "#0b141a";
  const COLOR_SENT = "#1f8a70";
  const COLOR_RECEIVED = "#202c33";
  const COLOR_TEXT = "#e9edef";

  const MSG_1 = "Hey, how are you?";
  const MSG_2 = "Great, thanks!";
  const MSG_3 = "Want to grab coffee?";

  const FONT_SIZE = 44;
  const FADE_DURATION = 18;
  const STAGGER_DELAY = 38;
  const SLIDE_DISTANCE = 40;
  const BOUNCE_DAMPING = 12;
  const BOUNCE_STIFFNESS = 170;
  const BUBBLE_RADIUS = 18;
  const BUBBLE_PADDING_X = 24;
  const BUBBLE_PADDING_Y = 18;
  const ROW_GAP = 22;
  const MAX_WIDTH_PERCENT = 72;

  // Derived timing
  const MSG1_START = 0;
  const MSG2_START = MSG1_START + FADE_DURATION + STAGGER_DELAY;
  const MSG3_START = MSG2_START + FADE_DURATION + STAGGER_DELAY;

  // Helper component for repeated bubbles
  const MessageRow = ({text, align, start}: {text: string, align: string, start: number}) => {
    const local = frame - start;
    const opacity = interpolate(local, [0, FADE_DURATION], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const bounce = spring({frame: Math.max(0, local), fps, config: {damping: BOUNCE_DAMPING, stiffness: BOUNCE_STIFFNESS}});
    const scale = interpolate(bounce, [0, 1], [0.98, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const xFrom = align === "right" ? SLIDE_DISTANCE : -SLIDE_DISTANCE;
    const tx = interpolate(opacity, [0, 1], [xFrom, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    const bubbleBg = align === "right" ? COLOR_SENT : COLOR_RECEIVED;

    return (
      <div style={{width: "100%", display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start", marginTop: ROW_GAP}}>
        <div style={{
          maxWidth: \`\${MAX_WIDTH_PERCENT}%\`,
          backgroundColor: bubbleBg,
          color: COLOR_TEXT,
          padding: \`\${BUBBLE_PADDING_Y}px \${BUBBLE_PADDING_X}px\`,
          borderRadius: BUBBLE_RADIUS,
          fontSize: FONT_SIZE,
          opacity,
          transform: \`translateX(\${tx}px) scale(\${scale})\`,
          transformOrigin: align === "right" ? "100% 100%" : "0% 100%"
        }}>
          {text}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{
      backgroundColor: COLOR_BACKGROUND,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: Math.max(36, Math.round(width * 0.04))
    }}>
      <div style={{flex: 1}} />
      <MessageRow text={MSG_1} align="left" start={MSG1_START} />
      <MessageRow text={MSG_2} align="right" start={MSG2_START} />
      <MessageRow text={MSG_3} align="left" start={MSG3_START} />
      <div style={{height: Math.max(20, Math.round(height * 0.02))}} />
    </AbsoluteFill>
  );
};

---

EXAMPLE 3: Rotating word carousel

Prompt: "Text that dissolves between different words"

import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";

export const MyAnimation = () => {
  /*
   * Prefix text with rotating words that crossfade with blur.
   */
  const frame = useCurrentFrame();

  const COLOR_TEXT = "#7b92c1";
  const PREFIX = "Created for";
  const WORDS = ["Creators", "Marketers", "Developers", "Everyone"];

  const PREFIX_FONT_SIZE = 80;
  const WORD_FONT_SIZE = 80;
  const PREFIX_WEIGHT = 300;
  const WORD_WEIGHT = 700;
  const WORD_GAP = 20;
  const HOLD_DURATION = 32;
  const FLIP_DURATION = 18;
  const BLUR_AMOUNT = 6;

  const perStep = HOLD_DURATION + FLIP_DURATION;
  const totalSteps = WORDS.length;
  const currentStep = Math.floor(frame / perStep) % totalSteps;
  const nextStep = (currentStep + 1) % totalSteps;
  const phase = frame % perStep;
  const isFlipping = phase >= HOLD_DURATION;
  const flipProgress = isFlipping ? (phase - HOLD_DURATION) / FLIP_DURATION : 0;

  const outOpacity = interpolate(flipProgress, [0, 1], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const inOpacity = interpolate(flipProgress, [0, 1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const outBlur = interpolate(flipProgress, [0, 1], [0, BLUR_AMOUNT], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const inBlur = interpolate(flipProgress, [0, 1], [BLUR_AMOUNT, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  // Find longest word for stable width
  const longestWord = WORDS.reduce((a, b) => a.length >= b.length ? a : b, WORDS[0]);

  return (
    <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div style={{display: "flex", alignItems: "baseline", gap: WORD_GAP, color: COLOR_TEXT}}>
        <div style={{fontSize: PREFIX_FONT_SIZE, fontWeight: PREFIX_WEIGHT}}>{PREFIX}</div>
        <div style={{position: "relative", fontSize: WORD_FONT_SIZE, fontWeight: WORD_WEIGHT}}>
          {/* Invisible width keeper */}
          <div style={{visibility: "hidden"}}>{longestWord}</div>
          {/* Current word (fades out during flip) */}
          {!isFlipping && (
            <div style={{position: "absolute", left: 0, top: 0}}>{WORDS[currentStep]}</div>
          )}
          {/* Crossfade during flip */}
          {isFlipping && (
            <>
              <div style={{position: "absolute", left: 0, top: 0, opacity: outOpacity, filter: \`blur(\${outBlur}px)\`}}>
                {WORDS[currentStep]}
              </div>
              <div style={{position: "absolute", left: 0, top: 0, opacity: inOpacity, filter: \`blur(\${inBlur}px)\`}}>
                {WORDS[nextStep]}
              </div>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

---

EXAMPLE 4: Animated bar chart / histogram

Prompt: "An animated histogram with the gold price. Focus on simplicity and elegance. Small headline, all bars are well laid out"

import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring } from "remotion";

export const MyAnimation = () => {
  /*
   * Elegant animated bar chart showing gold prices with Y-axis, staggered spring animations, and full-width layout.
   */
  const frame = useCurrentFrame();
  const { fps, height: videoHeight } = useVideoConfig();

  const TITLE = "Gold Price 2024";
  const UNIT = "USD per troy ounce";
  const COLOR_BAR = "#D4AF37";
  const COLOR_TEXT = "#ffffff";
  const COLOR_MUTED = "#888888";
  const COLOR_BG = "#0a0a0a";
  const COLOR_AXIS = "#333333";

  const PADDING = 50;
  const HEADER_HEIGHT = 70;
  const LABEL_HEIGHT = 32;
  const BAR_GAP = 8;
  const BAR_RADIUS = 4;
  const TITLE_FONT_SIZE = 24;
  const LABEL_FONT_SIZE = 11;
  const VALUE_FONT_SIZE = 11;
  const AXIS_FONT_SIZE = 12;
  const STAGGER_DELAY = 5;
  const HEADER_START_FRAME = 0;
  const BARS_START_FRAME = 10;
  const SPRING_DAMPING = 18;
  const SPRING_STIFFNESS = 80;

  const data = [
    { month: "Jan", price: 2039 },
    { month: "Feb", price: 2024 },
    { month: "Mar", price: 2160 },
    { month: "Apr", price: 2330 },
    { month: "May", price: 2327 },
    { month: "Jun", price: 2339 },
    { month: "Jul", price: 2426 },
    { month: "Aug", price: 2503 },
    { month: "Sep", price: 2634 },
    { month: "Oct", price: 2735 },
    { month: "Nov", price: 2672 },
    { month: "Dec", price: 2650 },
  ];

  const minPrice = 1900;
  const maxPrice = 2800;
  const priceRange = maxPrice - minPrice;
  const chartHeight = videoHeight - (PADDING * 2) - HEADER_HEIGHT - LABEL_HEIGHT;
  const yAxisSteps = [1900, 2100, 2300, 2500, 2700];

  const headerOpacity = spring({
    frame: frame - HEADER_START_FRAME,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR_BG,
        padding: PADDING,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ height: HEADER_HEIGHT, opacity: headerOpacity, marginBottom: 10 }}>
        <div style={{ color: COLOR_TEXT, fontSize: TITLE_FONT_SIZE, fontWeight: 600 }}>{TITLE}</div>
        <div style={{ color: COLOR_MUTED, fontSize: 14, marginTop: 4 }}>{UNIT}</div>
      </div>

      {/* Chart container */}
      <div style={{ display: "flex", alignItems: "flex-end", width: "100%", flex: 1 }}>
        {/* Y-Axis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: chartHeight,
            paddingRight: 12,
            marginBottom: LABEL_HEIGHT,
          }}
        >
          {yAxisSteps.slice().reverse().map((step) => (
            <div
              key={step}
              style={{
                color: COLOR_MUTED,
                fontSize: AXIS_FONT_SIZE,
                textAlign: "right",
                minWidth: 40,
              }}
            >
              {step.toLocaleString()}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: BAR_GAP,
            height: chartHeight,
            flex: 1,
            borderLeft: \`1px solid \${COLOR_AXIS}\`,
            borderBottom: \`1px solid \${COLOR_AXIS}\`,
            paddingLeft: 8,
          }}
        >
          {data.map((item, i) => {
            const delay = i * STAGGER_DELAY;
            const progress = spring({
              frame: frame - delay - BARS_START_FRAME,
              fps,
              config: { damping: SPRING_DAMPING, stiffness: SPRING_STIFFNESS },
            });

            const normalizedHeight = ((item.price - minPrice) / priceRange) * chartHeight;
            const height = normalizedHeight * progress;

            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height,
                    backgroundColor: COLOR_BAR,
                    borderRadius: \`\${BAR_RADIUS}px \${BAR_RADIUS}px 0 0\`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingTop: 6,
                    minHeight: height > 0 ? 4 : 0,
                  }}
                >
                  {height > 30 && (
                    <span
                      style={{
                        color: COLOR_BG,
                        fontSize: VALUE_FONT_SIZE,
                        fontWeight: 600,
                        opacity: progress,
                      }}
                    >
                      {item.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    color: COLOR_MUTED,
                    fontSize: LABEL_FONT_SIZE,
                    marginTop: 8,
                    height: LABEL_HEIGHT - 8,
                  }}
                >
                  {item.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

----
END OF EXAMPLES

IMPORTANT RULES:
- Start with proper ES6 imports, then export the component as: export const MyAnimation = () => {...}
- Start the component body with a multi-line comment (/* */) containing a 2-3 sentence description of what you're building
- ALWAYS include the necessary imports at the top of the file

AVAILABLE IMPORTS (use exactly these import statements):
- import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring, Sequence } from "remotion";
- import { Circle, Rect, Triangle, Star, Ellipse, Pie } from "@remotion/shapes";
- import { Lottie } from "@remotion/lottie";
- import { ThreeCanvas } from "@remotion/three";

REACT HOOKS:
- Import React hooks using named imports: import { useState, useEffect } from "react";
- Example: const [data, setData] = useState(null);

EXPORT FORMAT:
- Always export as: export const MyAnimation = () => { ... };
- Do not use default exports

- Use creative animations with smooth transitions
- Component should use frame-based animations with interpolate()
- Make it visually impressive and modern
- Use inline styles for all styling
- ALWAYS use fontFamily: 'Inter, sans-serif' for ALL text elements to ensure consistent rendering
- Do not generate typescript types or interfaces
- ALWAYS make sure to show all contents on the screen WITHOUT going off-screen or being cut off
- ALWAYS set backgroundColor on AbsoluteFill from frame 0 - never fade in backgrounds
- NEVER NEVER NEVER use fade-in for the AbsoluteFill container - always have it fully visible from frame 0

`;


// ============================================================================
// AI-POWERED DYNAMIC VIDEO GENERATION SYSTEM
// ============================================================================

// Helper: Analyze prompt and determine video structure
interface VideoScene {
  type: 'title' | 'bullets' | 'statistic' | 'infographic' | 'comparison';
  data: any;
  duration: number; // frames
}

interface VideoContent {
  title: string;
  subtitle?: string;
  scenes: VideoScene[];
  backgroundColor: string;
}

function analyzePrompt(prompt: string): VideoContent {
  const normalizedPrompt = prompt.toLowerCase();
  const scenes: VideoScene[] = [];

  // Determine video type and structure based on keywords
  const isComparison = /\b(vs|versus|compare|comparison|before.*after|difference)\b/i.test(prompt);
  const isStatistic = /\b(statistics?|data|numbers?|percent|million|billion)\b/i.test(prompt);
  const isHowTo = /\b(how to|steps?|process|tutorial|guide)\b/i.test(prompt);
  const isList = /\b(top|list|reasons?|ways?|tips?|benefits?)\b/i.test(prompt);
  const isEducational = /\b(explain|what is|learn|understand|introduction|overview)\b/i.test(prompt);

  // Extract title from prompt
  let title = prompt.trim();
  let subtitle = "";

  // Clean up common prompt patterns
  title = title.replace(/^(explain|what is|how to|create|make|show me)\s+/i, '');
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Limit title length
  if (title.length > 50) {
    const words = title.split(' ');
    title = words.slice(0, 5).join(' ');
    if (words.length > 5) title += '...';
  }

  // Add title scene
  scenes.push({
    type: 'title',
    data: { title, subtitle },
    duration: 90
  });

  // Generate content based on prompt type
  if (isComparison) {
    // Generate comparison content
    scenes.push({
      type: 'comparison',
      data: {
        heading: "Key Differences",
        comparisons: [
          { before: "Traditional approach", after: "Modern solution" },
          { before: "Old method", after: "New innovation" },
          { before: "Previous standard", after: "Current best practice" }
        ]
      },
      duration: 180
    });
  } else if (isStatistic) {
    // Generate statistic content
    scenes.push({
      type: 'statistic',
      data: {
        statNumber: "100+",
        statLabel: "Key Metric",
        description: "Significant impact in this area"
      },
      duration: 120
    });
  } else if (isHowTo || isList) {
    // Generate list/steps content
    const items = [
      "First important point",
      "Second key concept",
      "Third essential element",
      "Fourth critical aspect",
      "Fifth major factor"
    ];

    scenes.push({
      type: 'bullets',
      data: {
        heading: isHowTo ? "Steps" : "Key Points",
        items
      },
      duration: 180
    });
  } else if (isEducational) {
    // Educational format: bullets + infographic
    scenes.push({
      type: 'bullets',
      data: {
        heading: "Overview",
        items: [
          "Core concept explanation",
          "Key characteristics",
          "Important applications",
          "Common examples"
        ]
      },
      duration: 180
    });

    scenes.push({
      type: 'infographic',
      data: {
        title: "Key Components",
        items: [
          { title: "Component 1", description: "Description" },
          { title: "Component 2", description: "Description" },
          { title: "Component 3", description: "Description" }
        ]
      },
      duration: 150
    });
  } else {
    // Default: bullets
    scenes.push({
      type: 'bullets',
      data: {
        heading: "Key Points",
        items: [
          "Important aspect one",
          "Critical element two",
          "Essential factor three"
        ]
      },
      duration: 150
    });
  }

  return {
    title,
    subtitle,
    scenes,
    backgroundColor: '#ffffff'
  };
}

// Helper: Generate inline template components code
function generateInlineComponents(): string {
  return `
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
        <h1 style={{ fontSize: 112, fontWeight: 800, color: '#1a1a1a', marginBottom: 24, transform: \`scale(\${titleScale})\`, fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 56, fontWeight: 300, color: '#4a5568', opacity: subtitleOpacity, transform: \`translateY(\${subtitleTranslateY}px)\`, fontFamily: 'Inter, sans-serif' }}>
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
      <h2 style={{ fontSize: 96, fontWeight: 700, color: '#2d3748', marginBottom: 80, transform: \`translateY(\${headingTranslateY}px)\`, opacity: headingOpacity, fontFamily: 'Inter, sans-serif' }}>
        {heading}
      </h2>
      <div style={{ width: '100%', maxWidth: 1600 }}>
        {items.map((item, index) => {
          const itemEnterFrame = index * 30 + 45;
          const itemOpacity = interpolate(frame, [itemEnterFrame, itemEnterFrame + 30], [0, 1], { extrapolateRight: 'clamp' });
          const itemTranslateY = spring({ frame: frame - itemEnterFrame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 30, from: 50, to: 0 });

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 32, padding: 24, backgroundColor: '#ebf8ff', borderRadius: 12, opacity: itemOpacity, transform: \`translateY(\${itemTranslateY}px)\` }}>
              <p style={{ fontSize: 48, color: '#2d3748', flex: 1, fontFamily: 'Inter, sans-serif' }}>{item}</p>
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
        <h1 style={{ fontSize: 192, fontWeight: 800, color: '#c53030', marginBottom: 32, transform: \`scale(\${numberScale})\`, opacity: numberOpacity, fontFamily: 'Inter, sans-serif' }}>
          {statNumber}
        </h1>
        <h2 style={{ fontSize: 112, fontWeight: 700, color: '#2d3748', marginBottom: 24, transform: \`translateY(\${textTranslateY}px)\`, opacity: textOpacity, fontFamily: 'Inter, sans-serif' }}>
          {statLabel}
        </h2>
        <p style={{ fontSize: 64, color: '#4a5568', maxWidth: 1200, margin: '0 auto', transform: \`translateY(\${textTranslateY}px)\`, opacity: textOpacity, fontFamily: 'Inter, sans-serif' }}>
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
      <h2 style={{ fontSize: 96, fontWeight: 800, color: '#2d3748', marginBottom: 80, transform: \`translateY(\${titleTranslateY}px)\`, opacity: titleOpacity, fontFamily: 'Inter, sans-serif' }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, width: '100%', maxWidth: 2400 }}>
        {items.map((item, index) => {
          const itemEnterFrame = index * 40 + 45;
          const itemScale = spring({ frame: frame - itemEnterFrame, fps, config: { damping: 200, stiffness: 100 }, durationInFrames: 45, from: 0.5, to: 1 });
          const itemOpacity = interpolate(frame, [itemEnterFrame, itemEnterFrame + 30], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#f7fafc', padding: 32, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transform: \`scale(\${itemScale})\`, opacity: itemOpacity }}>
              <h3 style={{ fontSize: 64, fontWeight: 700, color: '#2d3748', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>{item.title}</h3>
              <p style={{ fontSize: 32, color: '#4a5568', fontFamily: 'Inter, sans-serif' }}>{item.description}</p>
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
      <h2 style={{ fontSize: 96, fontWeight: 700, color: '#2d3748', marginBottom: 80, transform: \`translateY(\${headingTranslateY}px)\`, opacity: headingOpacity, fontFamily: 'Inter, sans-serif' }}>
        {heading}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, width: '100%', maxWidth: 2400, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 80, fontWeight: 800, color: '#c53030', marginBottom: 40, fontFamily: 'Inter, sans-serif' }}>Before</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 80, fontWeight: 800, color: '#38a169', marginBottom: 40, fontFamily: 'Inter, sans-serif' }}>After</h3>
        </div>
        {comparisons.map((item, index) => {
          const itemDelay = 40 + index * 40;
          const itemTranslateX = spring({ frame: frame - itemDelay, fps, from: -100, to: 0, durationInFrames: 45 });
          const itemOpacity = interpolate(frame, [itemDelay, itemDelay + 30], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <>
              <div key={\`before-\${index}\`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fed7d7', borderRadius: 24, transform: \`translateX(\${itemTranslateX}px)\`, opacity: itemOpacity }}>
                <p style={{ fontSize: 48, fontWeight: 600, color: '#742a2a', fontFamily: 'Inter, sans-serif' }}>{item.before}</p>
              </div>
              <div key={\`after-\${index}\`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#c6f6d5', borderRadius: 24, transform: \`translateX(\${itemTranslateX * -1}px)\`, opacity: itemOpacity }}>
                <p style={{ fontSize: 48, fontWeight: 600, color: '#22543d', fontFamily: 'Inter, sans-serif' }}>{item.after}</p>
              </div>
            </>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};`;
}

// Helper: Build dynamic video code
function buildVideoCode(content: VideoContent, targetDuration: number): string {
  let currentFrame = 0;
  const sequences: string[] = [];

  // Generate sequences for each scene
  for (const scene of content.scenes) {
    const sceneCode = generateSceneCode(scene, currentFrame);
    sequences.push(sceneCode);
    currentFrame += scene.duration;
  }

  // Build complete code
  const code = `import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const MyAnimation = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '${content.backgroundColor}' }}>
      ${sequences.join('\n      ')}
    </AbsoluteFill>
  );
};

${generateInlineComponents()}
`;

  return code;
}

// Helper: Generate code for a specific scene
function generateSceneCode(scene: VideoScene, startFrame: number): string {
  switch (scene.type) {
    case 'title':
      return `<Sequence from={${startFrame}} durationInFrames={${scene.duration}}>
        <TitleCard title="${scene.data.title}" subtitle="${scene.data.subtitle || ''}" />
      </Sequence>`;

    case 'bullets':
      const items = scene.data.items.map((item: string) => `'${item}'`).join(', ');
      return `<Sequence from={${startFrame}} durationInFrames={${scene.duration}}>
        <BulletList heading="${scene.data.heading}" items={[${items}]} />
      </Sequence>`;

    case 'statistic':
      return `<Sequence from={${startFrame}} durationInFrames={${scene.duration}}>
        <Statistic 
          statNumber="${scene.data.statNumber}" 
          statLabel="${scene.data.statLabel}" 
          description="${scene.data.description}" 
        />
      </Sequence>`;

    case 'infographic':
      const infoItems = scene.data.items.map((item: any) =>
        `{ title: '${item.title}', description: '${item.description}' }`
      ).join(', ');
      return `<Sequence from={${startFrame}} durationInFrames={${scene.duration}}>
        <Infographic title="${scene.data.title}" items={[${infoItems}]} />
      </Sequence>`;

    case 'comparison':
      const comparisons = scene.data.comparisons.map((item: any) =>
        `{ before: '${item.before}', after: '${item.after}' }`
      ).join(', ');
      return `<Sequence from={${startFrame}} durationInFrames={${scene.duration}}>
        <Comparison heading="${scene.data.heading}" comparisons={[${comparisons}]} />
      </Sequence>`;

    default:
      return '';
  }
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(req: Request) {
  const { prompt, duration = "1min" } = await req.json();

  // Map duration ID to specific frame counts
  const durationMap: Record<string, number> = {
    "1min": 1800,
    "3min": 5400,
    "10min": 18000,
  };

  const targetDuration = durationMap[duration] || 1800;

  console.log("AI-Powered Generation - Prompt:", prompt);
  console.log("Requested duration:", duration, "->", targetDuration, "frames");

  // Step 1: Analyze prompt and generate video structure
  const videoContent = analyzePrompt(prompt);
  console.log("Generated video structure:", videoContent.scenes.length, "scenes");

  // Step 2: Build dynamic code
  let generatedCode = buildVideoCode(videoContent, targetDuration);

  // Step 3: Add duration enforcement
  generatedCode += `\n\n// Duration enforcement\ntry {\n  if (typeof MyAnimation !== 'undefined') {\n    MyAnimation.durationInFrames = ${targetDuration};\n  }\n} catch (e) {}\n`;

  // Step 4: Stream the response
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      const chunkSize = 100;
      let position = 0;

      const interval = setInterval(() => {
        if (position >= generatedCode.length) {
          clearInterval(interval);
          controller.close();
          return;
        }

        const chunk = generatedCode.slice(position, position + chunkSize);
        controller.enqueue(encoder.encode(chunk));
        position += chunkSize;
      }, 20); // 20ms per chunk
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

