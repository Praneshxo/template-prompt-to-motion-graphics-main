---
name: daisy
description: >
  Daisy — Nex Multi-Scene Video Generation Skill. Generates a single, self-contained
  Animation.tsx that merges 2 or more template scenes (intro, bar chart, bullet list,
  comparison, outro, etc.) into one conflict-free Remotion video file. All scenes are
  sequenced without time overlap, duration conflicts, or code errors. The output is
  always one TSX file with a single propsSchema, a single Animation export, and all
  sub-scene components defined inline above the main component.
metadata:
  tags:
    - remotion
    - animation
    - template
    - nex
    - video
    - tsx
    - multi-scene
    - composition
    - daisy
---

# daisy — Nex Multi-Scene Video Generation Skill

## Purpose

Use this skill whenever you need to generate or modify an `Animation.tsx` that contains
**two or more merged template scenes** for the Nex platform. This skill governs how
individual scene components are combined into a single conflict-free composition — with
correct `<Sequence>` offsets, a unified `propsSchema`, and no duplicate identifiers.

---

## Platform Context: Nex

- **Stack**: Next.js 14, TypeScript, Tailwind, Remotion 4.x
- **Output**: Always **one file** — `Animation.tsx` — no matter how many scenes
- **Render**: Railway.app Node.js, `renderMedia()` → Cloudflare R2
- **Validation**: `tsc --noEmit` + 10-frame dry run before full render
- **propsSchema**: Single merged `z.object({...})` covering all scene props

---

## Core Remotion Rules

### Imports — always named imports from `remotion`

```tsx
import { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";
```

### Animation — `interpolate` and `spring`

```tsx
// Always clamp unless intentional overflow
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease),
});

// Spring for physics-based motion
const scale = spring({
  fps,
  frame,
  config: { damping: 14, stiffness: 180, mass: 1 },
  durationInFrames: 40,
});
```

**Hard rules:**
- Never animate with `useState` + `useEffect` — Remotion controls time
- Never use `Math.random()` — use deterministic values only
- Never use `Date.now()` or `new Date()` — use `frame` as time source
- ALWAYS set `backgroundColor` on `AbsoluteFill` from frame 0; never fade in backgrounds

---

## ━━━ MULTI-SCENE MERGE RULES (CRITICAL) ━━━

These rules govern how multiple templates are merged into one `Animation.tsx`.

### Rule 1 — One File, One Export

```
✅ One propsSchema   → merged z.object({...}) for all scenes
✅ One Animation     → export const Animation = (props: Props) => ...
✅ One default export → export default Animation;
❌ Never multiple Animation exports
❌ Never multiple propsSchema exports
❌ Never multiple loadFont() calls
```

### Rule 2 — Sequential Sequencing (No Overlap, No Gap Unless Intentional)

Each scene gets a `<Sequence from={N} durationInFrames={D}>` that starts exactly
where the previous scene ends. Use a `SCENE_DURATIONS` constant map so offsets
are derived, never hardcoded redundantly.

```tsx
// ✅ Correct — derive offsets from duration constants
const D_INTRO   = 150;  // frames
const D_CHART   = 180;
const D_BULLETS = 180;
const D_OUTRO   = 120;

const OFF_INTRO   = 0;
const OFF_CHART   = OFF_INTRO   + D_INTRO;   // 150
const OFF_BULLETS = OFF_CHART   + D_CHART;   // 330
const OFF_OUTRO   = OFF_BULLETS + D_BULLETS; // 510
const TOTAL       = OFF_OUTRO   + D_OUTRO;   // 630

// ❌ Wrong — duplicated magic numbers that cause overlap
<Sequence from={0}   durationInFrames={150}>...</Sequence>
<Sequence from={150} durationInFrames={180}>...</Sequence>
<Sequence from={150} durationInFrames={180}>...</Sequence>  // OVERLAP!
```

### Rule 3 — Scene Components Use Local `frame` (Sequence Resets It)

Every scene sub-component calls `useCurrentFrame()` independently.
`<Sequence>` resets `frame` to `0` at its `from` offset, so each scene
always starts at `frame === 0` internally.

```tsx
// ✅ Correct — each scene component is self-contained
const IntroScene = ({ title, accentColor }: SceneProps) => {
  const frame = useCurrentFrame();  // starts at 0 inside Sequence
  const { fps } = useVideoConfig();
  // ... animations relative to local frame
};
```

### Rule 4 — Unique Component Names

When merging templates that originally all exported `Animation`, rename each
scene component descriptively. Never have two components with the same name.

```tsx
// ✅ Correct
const IntroTitleScene = ...
const BarChartScene   = ...
const BulletListScene = ...
const OutroScene      = ...

// ❌ Wrong
const Animation = ...  // duplicate name
const Animation = ...  // causes TS error
```

### Rule 5 — Single loadFont() at Top Level

```tsx
// ✅ One call at module level
const { fontFamily } = loadFont();

// ❌ Never inside components or duplicated
```

### Rule 6 — Merged propsSchema

Combine all template-level props into one flat schema with no key collisions.
Prefix conflicting keys with the scene name if needed.

```tsx
export const propsSchema = z.object({
  // Intro
  introTitle:      z.string().default("Welcome"),
  introSubtitle:   z.string().default("A quick look at what matters"),
  // Chart
  chartTitle:      z.string().default("Revenue 2024"),
  chartData:       z.array(ChartItem).default([...]),
  // Bullets
  bulletHeading:   z.string().default("Key Points"),
  bulletItems:     z.array(z.string()).default([...]),
  // Shared
  accentColor:     z.string().default("#4F46E5"),
  background:      z.string().default("#FFFFFF"),
  textColor:       z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;
```

### Rule 7 — Total Duration in Header Comment

Always declare the summed total in the file header:

```tsx
// DURATION: 630 frames at 30fps (~21s) [INTRO:150 + CHART:180 + BULLETS:180 + OUTRO:120]
```

---

## File Structure Template (Multi-Scene)

```tsx
// ============================================================
// TEMPLATE: <Descriptive Name>
// CATEGORY: Multi-Scene Composition
// DESCRIPTION: <one-liner of what the full video covers>
// DIMENSIONS: 1920x1080 | 30fps
// DURATION: <TOTAL> frames at 30fps (~<Xs>) [SCENE1:<D> + SCENE2:<D> + ...]
// ============================================================

import { useMemo } from "react";
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

// ─── Zod sub-schemas for complex array items ──────────────────
const ChartItemSchema = z.object({ label: z.string(), value: z.number() });

// ─── Merged Props Schema ──────────────────────────────────────
export const propsSchema = z.object({
  // Scene 1 — Intro
  introTitle:    z.string().default("Your Title"),
  introSubtitle: z.string().default("Your subtitle"),
  // Scene 2 — Bar Chart
  chartTitle:    z.string().default("Key Metric"),
  chartData:     z.array(ChartItemSchema).default([
    { label: "Q1", value: 420 },
    { label: "Q2", value: 680 },
    { label: "Q3", value: 540 },
    { label: "Q4", value: 820 },
  ]),
  // Scene 3 — Bullet List
  bulletHeading: z.string().default("Key Takeaways"),
  bulletItems:   z.array(z.string()).min(2).max(6).default([
    "First important point",
    "Second important point",
    "Third important point",
  ]),
  // Scene 4 — Outro
  outroTitle:    z.string().default("Thank You"),
  outroCta:      z.string().default("Learn more at nex.com"),
  // Shared design tokens
  accentColor:   z.string().default("#4F46E5"),
  background:    z.string().default("#FFFFFF"),
  textColor:     z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

// ─── SCENE DURATION CONSTANTS ─────────────────────────────────
const D_INTRO   = 150;
const D_CHART   = 180;
const D_BULLETS = 180;
const D_OUTRO   = 120;

const OFF_INTRO   = 0;
const OFF_CHART   = OFF_INTRO   + D_INTRO;
const OFF_BULLETS = OFF_CHART   + D_CHART;
const OFF_OUTRO   = OFF_BULLETS + D_BULLETS;

// ─── SCENE 1: Intro Title ─────────────────────────────────────
const IntroTitleScene = ({ title, subtitle, accentColor, background, textColor }: {
  title: string; subtitle: string; accentColor: string;
  background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY   = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 45 });
  const titleOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subOp    = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW    = interpolate(frame, [40, 80], [0, 120], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "0 120px" }}>
        <div style={{
          opacity: titleOp,
          transform: `translateY(${(1 - titleY) * 40}px)`,
          fontSize: 96, fontWeight: 700, color: textColor,
          lineHeight: 1.1, letterSpacing: "-0.03em",
        }}>
          {title}
        </div>
        <div style={{
          width: lineW, height: 4, background: accentColor,
          borderRadius: 2, margin: "28px auto",
        }} />
        <div style={{
          opacity: subOp * 0.6, fontSize: 36, color: textColor,
          fontWeight: 400, letterSpacing: "-0.01em",
        }}>
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: Bar Chart ───────────────────────────────────────
const BarChartScene = ({ chartTitle, chartData, accentColor, background, textColor }: {
  chartTitle: string;
  chartData: Array<{ label: string; value: number }>;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal   = useMemo(() => Math.max(...chartData.map(d => d.value)), [chartData]);
  const titleOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const CHART_H  = 500;
  const BAR_GAP  = 12;

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 40, opacity: titleOp }}>
        {chartTitle}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: BAR_GAP, flex: 1 }}>
        {chartData.map((item, i) => {
          const delay    = i * 8;
          const sp       = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 18, stiffness: 80 }, durationInFrames: 50 });
          const barH     = (item.value / maxVal) * CHART_H * sp;
          const op       = interpolate(Math.max(0, frame - delay), [0, 15], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: CHART_H }}>
              <div style={{
                width: "100%", height: barH,
                background: accentColor,
                borderRadius: "8px 8px 0 0",
                opacity: op,
                display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 10,
                minHeight: barH > 0 ? 4 : 0,
              }}>
                {barH > 40 && (
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, opacity: op }}>
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
              <div style={{ color: textColor, fontSize: 20, marginTop: 10, opacity: 0.6, fontWeight: 500 }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3: Bullet List ─────────────────────────────────────
const BulletListScene = ({ heading, items, accentColor, background, textColor }: {
  heading: string; items: string[];
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headSp  = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });
  const headOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "80px 120px", display: "flex", flexDirection: "column" }}>
      <div style={{
        fontSize: 52, fontWeight: 800, color: textColor,
        letterSpacing: "-0.02em", marginBottom: 48,
        opacity: headOp, transform: `translateY(${(1 - headSp) * 20}px)`,
      }}>
        {heading}
      </div>
      {items.map((item, i) => {
        const delay  = 20 + i * 28;
        const local  = Math.max(0, frame - delay);
        const sp     = spring({ fps, frame: local, config: { damping: 18, stiffness: 140 }, durationInFrames: 35 });
        const op     = interpolate(local, [0, 15], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 28,
            marginBottom: 28, opacity: op,
            transform: `translateX(${(1 - sp) * -30}px)`,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              background: accentColor, flexShrink: 0,
            }} />
            <div style={{ fontSize: 36, color: textColor, fontWeight: 500, lineHeight: 1.3 }}>
              {item}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 4: Outro CTA ───────────────────────────────────────
const OutroScene = ({ outroTitle, outroCta, accentColor, background, textColor }: {
  outroTitle: string; outroCta: string;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp    = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const ctaOp = interpolate(frame, [40, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [30, 70], [0, 200], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "0 120px" }}>
        <div style={{
          fontSize: 88, fontWeight: 800, color: textColor,
          letterSpacing: "-0.03em", lineHeight: 1.1,
          opacity: sp, transform: `translateY(${(1 - sp) * 30}px)`,
        }}>
          {outroTitle}
        </div>
        <div style={{ width: lineW, height: 4, background: accentColor, borderRadius: 2, margin: "24px auto" }} />
        <div style={{ opacity: ctaOp, fontSize: 32, color: textColor, opacity: ctaOp * 0.55, fontWeight: 400 }}>
          {outroCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ─────────────────────────────────────────
export const Animation = (props: Props) => {
  const {
    introTitle, introSubtitle,
    chartTitle, chartData,
    bulletHeading, bulletItems,
    outroTitle, outroCta,
    accentColor, background, textColor,
  } = props;

  return (
    <AbsoluteFill style={{ background }}>
      <Sequence from={OFF_INTRO} durationInFrames={D_INTRO}>
        <IntroTitleScene
          title={introTitle} subtitle={introSubtitle}
          accentColor={accentColor} background={background} textColor={textColor}
        />
      </Sequence>

      <Sequence from={OFF_CHART} durationInFrames={D_CHART}>
        <BarChartScene
          chartTitle={chartTitle} chartData={chartData}
          accentColor={accentColor} background={background} textColor={textColor}
        />
      </Sequence>

      <Sequence from={OFF_BULLETS} durationInFrames={D_BULLETS}>
        <BulletListScene
          heading={bulletHeading} items={bulletItems}
          accentColor={accentColor} background={background} textColor={textColor}
        />
      </Sequence>

      <Sequence from={OFF_OUTRO} durationInFrames={D_OUTRO}>
        <OutroScene
          outroTitle={outroTitle} outroCta={outroCta}
          accentColor={accentColor} background={background} textColor={textColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

## How to Apply This Skill to a Prompt

When a user provides a prompt for a multi-scene video, follow this procedure:

### Step 1 — Parse the Prompt into Scenes

Read the prompt and identify each scene type requested. Map each to a scene component:

| Prompt keyword | Scene type |
|---|---|
| intro, title, welcome, opening | `IntroTitleScene` |
| bar chart, histogram, data, revenue | `BarChartScene` |
| bullet, list, points, takeaways | `BulletListScene` |
| comparison, vs, versus, before/after | `ComparisonScene` |
| timeline, steps, process, how it works | `StepByStepScene` |
| quote, testimonial, social proof | `QuoteScene` |
| statistic, stat, big number | `StatisticScene` |
| outro, cta, end, goodbye, thank you | `OutroScene` |

### Step 2 — Assign Duration per Scene

Use these standard durations unless the prompt specifies otherwise:

| Scene type | Standard duration |
|---|---|
| Intro / Title | 150 frames (~5s) |
| Bar Chart | 180 frames (~6s) |
| Line / Area Chart | 180 frames (~6s) |
| Pie / Donut | 150 frames (~5s) |
| Bullet List (≤4 items) | 180 frames (~6s) |
| Bullet List (5–6 items) | 210 frames (~7s) |
| Step-by-Step (≤4 steps) | 200 frames (~6.7s) |
| Step-by-Step (5 steps) | 250 frames (~8.3s) |
| Comparison Table | 180 frames (~6s) |
| Big Statistic | 120 frames (~4s) |
| Quote / Testimonial | 150 frames (~5s) |
| Timeline / Gantt | 180 frames (~6s) |
| Outro / CTA | 120 frames (~4s) |

### Step 3 — Compute Offsets Sequentially

```
OFF_SCENE_1 = 0
OFF_SCENE_2 = OFF_SCENE_1 + D_SCENE_1
OFF_SCENE_3 = OFF_SCENE_2 + D_SCENE_2
...
TOTAL = OFF_LAST + D_LAST
```

**Always define these as `const` variables at module scope** (outside the `Animation`
component but inside the file) so the offsets are derivations, not magic numbers.

### Step 4 — Merge propsSchema

Combine all scenes' props into one flat `z.object({...})`. Rules:
- Shared props (`accentColor`, `background`, `textColor`) appear **once**
- Per-scene props are prefixed: `chartTitle`, `bulletHeading`, `introTitle`
- All props have sensible `.default()` values so the template works out of the box

### Step 5 — Write Scene Components Above the Main Composition

Order in the file:
1. File header comment
2. Imports
3. `loadFont()`
4. Zod sub-schemas (if any)
5. `propsSchema` + `Props` type
6. `DURATION CONSTANTS` (D_X, OFF_X)
7. Scene sub-components (in scene order)
8. `Animation` main component
9. `export default Animation`

---

## Scene Component Library

Below are the canonical scene components to copy, rename, and adapt.
Each is **self-contained** — it uses `useCurrentFrame()` internally and
expects to run inside a `<Sequence>` that resets `frame` to 0.

---

### SCENE: IntroTitleScene

```tsx
const IntroTitleScene = ({ title, subtitle, accentColor, background, textColor }: {
  title: string; subtitle: string;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY  = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 45 });
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subOp   = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW   = interpolate(frame, [40, 80], [0, 120], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "0 120px" }}>
        <div style={{
          opacity: titleOp, transform: `translateY(${(1 - titleY) * 40}px)`,
          fontSize: 96, fontWeight: 700, color: textColor,
          lineHeight: 1.1, letterSpacing: "-0.03em",
        }}>
          {title}
        </div>
        <div style={{ width: lineW, height: 4, background: accentColor, borderRadius: 2, margin: "28px auto" }} />
        <div style={{ opacity: subOp * 0.6, fontSize: 36, color: textColor, fontWeight: 400 }}>
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

### SCENE: DarkHeroIntroScene

```tsx
const DarkHeroIntroScene = ({ eyebrow, title, tagline, accentColor, background }: {
  eyebrow: string; title: string; tagline: string;
  accentColor: string; background: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleSp    = spring({ fps, frame: Math.max(0, frame - 15), config: { damping: 16, stiffness: 100 }, durationInFrames: 50 });
  const taglineOp  = interpolate(frame, [45, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse  = interpolate(frame, [60, 90, 120, 150], [0.6, 1, 0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 300,
        background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 70%)`,
        opacity: glowPulse,
      }} />
      <div style={{ textAlign: "center", padding: "0 120px", position: "relative" }}>
        <div style={{
          opacity: eyebrowOp, fontSize: 18, fontWeight: 600,
          letterSpacing: "0.2em", color: accentColor, marginBottom: 24, textTransform: "uppercase",
        }}>
          {eyebrow}
        </div>
        <div style={{
          transform: `translateY(${(1 - titleSp) * 60}px)`,
          opacity: titleSp, fontSize: 108, fontWeight: 800,
          color: "#FFFFFF", lineHeight: 1.0, letterSpacing: "-0.04em",
        }}>
          {title}
        </div>
        <div style={{ opacity: taglineOp, marginTop: 32, fontSize: 32, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

### SCENE: BarChartScene

```tsx
const BarChartScene = ({ chartTitle, chartData, accentColor, background, textColor }: {
  chartTitle: string;
  chartData: Array<{ label: string; value: number }>;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal  = useMemo(() => Math.max(...chartData.map(d => d.value)), [chartData]);
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const CHART_H = 500;

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 40, opacity: titleOp }}>
        {chartTitle}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flex: 1 }}>
        {chartData.map((item, i) => {
          const delay = i * 8;
          const sp    = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 18, stiffness: 80 }, durationInFrames: 50 });
          const barH  = (item.value / maxVal) * CHART_H * sp;
          const op    = interpolate(Math.max(0, frame - delay), [0, 15], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: CHART_H }}>
              <div style={{
                width: "100%", height: barH,
                background: accentColor, borderRadius: "8px 8px 0 0",
                opacity: op, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 10,
                minHeight: barH > 0 ? 4 : 0,
              }}>
                {barH > 40 && <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, opacity: op }}>{item.value.toLocaleString()}</span>}
              </div>
              <div style={{ color: textColor, fontSize: 20, marginTop: 10, opacity: 0.6, fontWeight: 500 }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

---

### SCENE: LineChartScene

```tsx
const LineChartScene = ({ chartTitle, chartData, accentColor, background, textColor }: {
  chartTitle: string;
  chartData: Array<{ label: string; value: number }>;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = 1760; const H = 580; const PAD_X = 60; const PAD_Y = 40;
  const minVal = useMemo(() => Math.min(...chartData.map(d => d.value)), [chartData]);
  const maxVal = useMemo(() => Math.max(...chartData.map(d => d.value)), [chartData]);
  const range  = maxVal - minVal || 1;

  const points = useMemo(() => chartData.map((d, i) => ({
    x: PAD_X + (i / (chartData.length - 1)) * (W - PAD_X * 2),
    y: PAD_Y + (1 - (d.value - minVal) / range) * (H - PAD_Y * 2),
  })), [chartData, minVal, range]);

  const drawProgress = interpolate(frame, [10, 80], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const totalPathLen = 1800; // approximate

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 24, opacity: titleOp }}>
        {chartTitle}
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flex: 1 }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD_X} x2={W - PAD_X}
            y1={PAD_Y + t * (H - PAD_Y * 2)} y2={PAD_Y + t * (H - PAD_Y * 2)}
            stroke={textColor} strokeOpacity={0.08} strokeWidth={1} />
        ))}
        {/* Line */}
        <path d={pathD} fill="none" stroke={accentColor} strokeWidth={4}
          strokeDasharray={totalPathLen}
          strokeDashoffset={totalPathLen * (1 - drawProgress)} />
        {/* Dots */}
        {points.map((p, i) => {
          const dotOp = interpolate(frame, [10 + i * 8, 25 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <circle key={i} cx={p.x} cy={p.y} r={7} fill={accentColor} opacity={dotOp} />;
        })}
        {/* X labels */}
        {chartData.map((d, i) => (
          <text key={i} x={points[i].x} y={H - 4} textAnchor="middle"
            fill={textColor} fillOpacity={0.5} fontSize={18} fontFamily={fontFamily}>
            {d.label}
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
```

---

### SCENE: BulletListScene

```tsx
const BulletListScene = ({ heading, items, accentColor, background, textColor }: {
  heading: string; items: string[];
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headSp = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });
  const headOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "80px 120px", display: "flex", flexDirection: "column" }}>
      <div style={{
        fontSize: 52, fontWeight: 800, color: textColor,
        letterSpacing: "-0.02em", marginBottom: 48,
        opacity: headOp, transform: `translateY(${(1 - headSp) * 20}px)`,
      }}>
        {heading}
      </div>
      {items.map((item, i) => {
        const delay = 20 + i * 28;
        const local = Math.max(0, frame - delay);
        const sp    = spring({ fps, frame: local, config: { damping: 18, stiffness: 140 }, durationInFrames: 35 });
        const op    = interpolate(local, [0, 15], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 28,
            marginBottom: 28, opacity: op,
            transform: `translateX(${(1 - sp) * -30}px)`,
          }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: accentColor, flexShrink: 0 }} />
            <div style={{ fontSize: 36, color: textColor, fontWeight: 500, lineHeight: 1.3 }}>{item}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

---

### SCENE: StepByStepScene

```tsx
const StepByStepScene = ({ heading, steps, accentColor, background, textColor }: {
  heading: string; steps: string[];
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const framesPerStep = 50;
  const headOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headSp = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", padding: "80px 160px" }}>
      <div style={{ width: "100%" }}>
        <div style={{
          fontSize: 52, fontWeight: 800, color: textColor, letterSpacing: "-0.02em",
          marginBottom: 56, opacity: headOp, transform: `translateY(${(1 - headSp) * 20}px)`,
        }}>
          {heading}
        </div>
        {steps.map((step, i) => {
          const startFrame = 20 + i * framesPerStep;
          const local = Math.max(0, frame - startFrame);
          const sp  = spring({ fps, frame: local, config: { damping: 18, stiffness: 140 }, durationInFrames: 40 });
          const op  = interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" });
          const lineH = i < steps.length - 1
            ? interpolate(Math.max(0, frame - startFrame - 10), [0, 40], [0, 80], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
                easing: Easing.out(Easing.ease),
              })
            : 0;

          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 36, flexShrink: 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", background: accentColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 20,
                  transform: `scale(${sp})`, opacity: op,
                }}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 3, height: lineH, background: accentColor, opacity: 0.3, borderRadius: 2 }} />
                )}
              </div>
              <div style={{
                fontSize: 36, color: textColor, fontWeight: 500, lineHeight: 1.3,
                paddingTop: 8, paddingBottom: 48,
                opacity: op, transform: `translateX(${(1 - sp) * 20}px)`,
              }}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

---

### SCENE: StatisticScene

```tsx
const StatisticScene = ({ statValue, statLabel, description, accentColor, background, textColor }: {
  statValue: string; statLabel: string; description: string;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numSp  = spring({ fps, frame, config: { damping: 16, stiffness: 80, mass: 1 }, durationInFrames: 50 });
  const numOp  = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const textY  = spring({ fps, frame: Math.max(0, frame - 25), config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
  const textOp = interpolate(frame, [25, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "0 120px" }}>
        <div style={{
          fontSize: 180, fontWeight: 900, color: accentColor, lineHeight: 1,
          letterSpacing: "-0.04em",
          transform: `scale(${0.7 + numSp * 0.3})`, opacity: numOp,
        }}>
          {statValue}
        </div>
        <div style={{
          fontSize: 52, fontWeight: 700, color: textColor, marginTop: 16,
          opacity: textOp, transform: `translateY(${(1 - textY) * 20}px)`,
        }}>
          {statLabel}
        </div>
        <div style={{ fontSize: 28, color: textColor, opacity: textOp * 0.5, marginTop: 16, fontWeight: 400 }}>
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

### SCENE: QuoteScene

```tsx
const QuoteScene = ({ quote, attribution, role, accentColor, background, textColor }: {
  quote: string; attribution: string; role: string;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markSp  = spring({ fps, frame, config: { damping: 14, stiffness: 90 }, durationInFrames: 40 });
  const quoteOp = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const attrOp  = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", padding: "0 160px" }}>
      <div style={{ maxWidth: 1400 }}>
        <div style={{
          fontSize: 120, color: accentColor, lineHeight: 0.6,
          fontWeight: 900, marginBottom: 16,
          transform: `scale(${markSp})`, transformOrigin: "left center",
        }}>
          &ldquo;
        </div>
        <div style={{
          fontSize: 52, color: textColor, lineHeight: 1.45,
          fontWeight: 400, opacity: quoteOp, fontStyle: "italic",
          letterSpacing: "-0.01em",
        }}>
          {quote}
        </div>
        <div style={{ marginTop: 36, opacity: attrOp }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: textColor }}>{attribution}</div>
          <div style={{ fontSize: 20, color: textColor, opacity: 0.45, marginTop: 4 }}>{role}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

### SCENE: ComparisonTableScene

```tsx
const ComparisonTableScene = ({ heading, colALabel, colBLabel, rows, accentColor, background, textColor }: {
  heading: string; colALabel: string; colBLabel: string;
  rows: Array<{ feature: string; colA: boolean; colB: boolean }>;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headerOp = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Check = ({ ok }: { ok: boolean }) => (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: ok ? accentColor : "#F1F5F9",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, color: ok ? "#fff" : "#94A3B8",
    }}>
      {ok ? "✓" : "✗"}
    </div>
  );

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "60px 120px" }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 40, opacity: titleOp }}>
        {heading}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8, opacity: headerOp }}>
        <div style={{ flex: 1 }} />
        <div style={{ width: 200, textAlign: "center", fontSize: 22, fontWeight: 700, color: accentColor }}>{colALabel}</div>
        <div style={{ width: 200, textAlign: "center", fontSize: 22, fontWeight: 700, color: textColor, opacity: 0.4 }}>{colBLabel}</div>
      </div>
      {rows.map((row, i) => {
        const delay  = 25 + i * 18;
        const local  = Math.max(0, frame - delay);
        const sp     = spring({ fps, frame: local, config: { damping: 18, stiffness: 140 }, durationInFrames: 35 });
        const op     = interpolate(local, [0, 15], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center",
            padding: "14px 0", borderBottom: `1px solid ${textColor}10`,
            opacity: op, transform: `translateX(${(1 - sp) * -20}px)`,
          }}>
            <div style={{ flex: 1, fontSize: 22, color: textColor, fontWeight: 500 }}>{row.feature}</div>
            <div style={{ width: 200, display: "flex", justifyContent: "center" }}><Check ok={row.colA} /></div>
            <div style={{ width: 200, display: "flex", justifyContent: "center" }}><Check ok={row.colB} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

---

### SCENE: GanttSprintScene

```tsx
const GanttSprintScene = ({ title, totalWeeks, tasks, accentColor, background, textColor }: {
  title: string; totalWeeks: number;
  tasks: Array<{ task: string; startWeek: number; endWeek: number; color?: string }>;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const COLORS = ["#4F46E5", "#059669", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "56px 80px" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 32, opacity: titleOp }}>
        {title}
      </div>
      <div style={{ display: "flex", marginLeft: 260, marginBottom: 8 }}>
        {Array.from({ length: totalWeeks }, (_, i) => (
          <div key={i} style={{ flex: 1, fontSize: 16, fontWeight: 600, color: textColor, opacity: 0.35, textAlign: "center" }}>W{i + 1}</div>
        ))}
      </div>
      {tasks.map((task, i) => {
        const delay  = 15 + i * 15;
        const local  = Math.max(0, frame - delay);
        const barW   = interpolate(local, [0, 50], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const op     = interpolate(local, [0, 15], [0, 1], { extrapolateRight: "clamp" });
        const left   = ((task.startWeek - 1) / totalWeeks) * 100;
        const width  = ((task.endWeek - task.startWeek + 1) / totalWeeks) * 100 * barW;
        const color  = task.color ?? COLORS[i % COLORS.length];

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 14, opacity: op }}>
            <div style={{ width: 250, fontSize: 18, fontWeight: 500, color: textColor, paddingRight: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {task.task}
            </div>
            <div style={{ flex: 1, height: 32, position: "relative", background: "#E5E7EB", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${left}%`, width: `${width}%`, height: "100%", background: color, borderRadius: 6 }} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

---

### SCENE: OutroScene

```tsx
const OutroScene = ({ outroTitle, outroCta, accentColor, background, textColor }: {
  outroTitle: string; outroCta: string;
  accentColor: string; background: string; textColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp    = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const ctaOp = interpolate(frame, [40, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [30, 70], [0, 200], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "0 120px" }}>
        <div style={{
          fontSize: 88, fontWeight: 800, color: textColor, letterSpacing: "-0.03em", lineHeight: 1.1,
          opacity: sp, transform: `translateY(${(1 - sp) * 30}px)`,
        }}>
          {outroTitle}
        </div>
        <div style={{ width: lineW, height: 4, background: accentColor, borderRadius: 2, margin: "24px auto" }} />
        <div style={{ opacity: ctaOp * 0.55, fontSize: 32, color: textColor, fontWeight: 400 }}>
          {outroCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## Design System Tokens

| Token | Value |
|---|---|
| Background (light) | `#FFFFFF` or `#F8F9FA` |
| Background (dark) | `#0F172A` or `#111827` |
| Primary accent | configurable via `accentColor` prop |
| Font | Inter (via `@remotion/google-fonts`) |
| Border radius | 8px–16px |
| Shadow | `0 4px 24px rgba(0,0,0,0.08)` |
| Padding | 48–80px (desktop), 32px (compact) |
| Motion style | Smooth spring entries, subtle fades, clean slides |

**Never use**: Comic Sans, neon gradients, text drop shadows, excessive emoji, cluttered layouts, `Math.random()`, `Date.now()`, or `useState/useEffect` for animation.

---

## Checklist Before Outputting the File

Before writing the final `Animation.tsx`, verify:

- [ ] Exactly **one** `loadFont()` call at module level
- [ ] Exactly **one** `propsSchema` export
- [ ] Exactly **one** `Animation` export + `export default Animation`
- [ ] All scene components have **unique names**
- [ ] Duration constants (`D_X`, `OFF_X`) are defined at module scope
- [ ] All `<Sequence from={OFF_X} durationInFrames={D_X}>` use derived constants
- [ ] No two sequences share the same `from` value (no overlap)
- [ ] Each scene sub-component calls `useCurrentFrame()` itself
- [ ] All `interpolate()` calls have `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"`
- [ ] File header comment includes `DURATION: TOTAL frames [SCENE1:D + SCENE2:D + ...]`
- [ ] Background color set from frame 0 on `AbsoluteFill` — no fade-in
- [ ] All text in JSX flows from props; no hardcoded UI strings
- [ ] `useMemo` wraps expensive computations (e.g., `maxVal`, SVG point arrays)
- [ ] No `fetch`, `setTimeout`, `setInterval`, `localStorage` or browser APIs

---

*— END OF daisy SKILL —*
