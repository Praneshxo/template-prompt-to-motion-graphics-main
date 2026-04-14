## ━━━ PART 2: TEMPLATES 26–50 ━━━

---

### TEMPLATE 26 — Pull Quote Card

**Category**: E — Quote & Social Proof  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 26: Pull Quote Card
// CATEGORY: Quote & Social Proof
// DESCRIPTION: Large typographic quote with author attribution, fade + slide in
// DIMENSIONS: 1920x1080 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  quote: z.string().default("The best way to predict the future is to create it."),
  author: z.string().default("Peter Drucker"),
  role: z.string().default("Management Consultant"),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  quote, author, role, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const markScale = spring({ fps, frame, config: { damping: 12, stiffness: 80 }, durationInFrames: 35 });
  const quoteOp = interpolate(frame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const quoteY = interpolate(frame, [20, 55], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const authorOp = interpolate(frame, [65, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 160px" }}>
      {/* Opening quote mark */}
      <div style={{
        fontSize: 200, lineHeight: 0.8, color: accentColor, fontWeight: 900,
        opacity: markOp * 0.4, transform: `scale(${markScale})`,
        transformOrigin: "left center", marginBottom: -20,
      }}>
        "
      </div>
      {/* Quote text */}
      <div style={{
        fontSize: 60, fontWeight: 600, color: textColor,
        lineHeight: 1.35, letterSpacing: "-0.02em",
        maxWidth: 1400,
        opacity: quoteOp, transform: `translateY(${quoteY}px)`,
      }}>
        {quote}
      </div>
      {/* Author */}
      <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 20, opacity: authorOp }}>
        <div style={{ width: 48, height: 3, background: accentColor, borderRadius: 2 }} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: textColor }}>{author}</div>
          <div style={{ fontSize: 18, color: textColor, opacity: 0.45, marginTop: 4 }}>{role}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 27 — Testimonial Card

**Category**: E — Quote & Social Proof  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 27: Testimonial Card
// CATEGORY: Quote & Social Proof
// DESCRIPTION: Customer testimonial with avatar initials, stars, and quote
// DIMENSIONS: 1920x1080 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  testimonial: z.string().default("Nex saved me 6 hours a week. I publish 3x more educational content now without hiring an editor."),
  customerName: z.string().default("Sarah K."),
  customerTitle: z.string().default("Course Creator, 42K subscribers"),
  initials: z.string().max(2).default("SK"),
  stars: z.number().min(1).max(5).default(5),
  accentColor: z.string().default("#F59E0B"),
  avatarBg: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  testimonial, customerName, customerTitle, initials, stars,
  accentColor, avatarBg, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const starsOp = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOp = interpolate(frame, [40, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const authorOp = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: 24, padding: "64px 72px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
        maxWidth: 1200, width: "100%",
        transform: `scale(${0.92 + cardSp * 0.08})`,
        opacity: cardSp,
      }}>
        {/* Stars */}
        <div style={{ fontSize: 32, marginBottom: 28, opacity: starsOp, letterSpacing: 4 }}>
          {Array.from({ length: stars }, (_, i) => (
            <span key={i} style={{ color: accentColor }}>★</span>
          ))}
          {Array.from({ length: 5 - stars }, (_, i) => (
            <span key={i} style={{ color: "#E5E7EB" }}>★</span>
          ))}
        </div>
        {/* Quote */}
        <div style={{
          fontSize: 42, color: textColor, lineHeight: 1.5,
          fontWeight: 400, marginBottom: 48, opacity: textOp,
          fontStyle: "italic",
        }}>
          "{testimonial}"
        </div>
        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: authorOp }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 24, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: textColor }}>{customerName}</div>
            <div style={{ fontSize: 18, color: textColor, opacity: 0.45, marginTop: 4 }}>{customerTitle}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 28 — Social Proof Numbers

**Category**: E — Quote & Social Proof  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 28: Social Proof Numbers
// CATEGORY: Quote & Social Proof
// DESCRIPTION: 3 large count-up stats that build credibility (users, videos, rating)
// DIMENSIONS: 1920x1080 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const StatItem = z.object({
  value: z.number(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  label: z.string(),
  decimals: z.number().default(0),
});

export const propsSchema = z.object({
  heading: z.string().default("Trusted by creators worldwide"),
  stats: z.array(StatItem).min(2).max(4).default([
    { value: 12000, prefix: "", suffix: "+", label: "Active Users", decimals: 0 },
    { value: 98000, prefix: "", suffix: "+", label: "Videos Created", decimals: 0 },
    { value: 4.9, prefix: "", suffix: "★", label: "Average Rating", decimals: 1 },
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  heading, stats, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headingSp = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{
      background, fontFamily,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "0 100px",
    }}>
      <div style={{
        fontSize: 36, color: textColor, opacity: headingOp * 0.5,
        fontWeight: 400, marginBottom: 64, letterSpacing: "-0.01em",
        transform: `translateY(${(1 - headingSp) * 20}px)`,
      }}>
        {heading}
      </div>
      <div style={{ display: "flex", gap: 80, justifyContent: "center" }}>
        {stats.map((stat, i) => {
          const delay = 20 + i * 25;
          const localFrame = Math.max(0, frame - delay);
          const progress = interpolate(localFrame, [0, 80], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
          const sp = spring({ fps, frame: localFrame, config: { damping: 16, stiffness: 100 }, durationInFrames: 40 });
          const displayVal = stat.decimals > 0
            ? (stat.value * progress).toFixed(stat.decimals)
            : Math.round(stat.value * progress).toLocaleString();

          return (
            <div key={i} style={{
              textAlign: "center", opacity: op,
              transform: `translateY(${(1 - sp) * 30}px)`,
            }}>
              <div style={{ fontSize: 96, fontWeight: 900, color: textColor, lineHeight: 1, letterSpacing: "-0.04em" }}>
                {stat.prefix}{displayVal}
                <span style={{ color: accentColor }}>{stat.suffix}</span>
              </div>
              <div style={{ fontSize: 22, color: textColor, opacity: 0.4, marginTop: 12, fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 29 — Tweet / Post Card

**Category**: E — Quote & Social Proof  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 29: Tweet / Post Card
// CATEGORY: Quote & Social Proof
// DESCRIPTION: Stylized social post card with handle, content, and engagement stats
// DIMENSIONS: 1920x1080 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  handle: z.string().default("@sarahkcreates"),
  displayName: z.string().default("Sarah K."),
  initials: z.string().max(2).default("SK"),
  avatarBg: z.string().default("#4F46E5"),
  content: z.string().default("Just published my 10th video using @NexVideo this month 🚀\n\nNo editor. No designer. Just AI + my ideas.\n\nThis is the future of content creation."),
  likes: z.string().default("2.4K"),
  reposts: z.string().default("847"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
  accentColor: z.string().default("#1D9BF0"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  handle, displayName, initials, avatarBg, content,
  likes, reposts, background, textColor, accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const contentOp = interpolate(frame, [30, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const statsOp = interpolate(frame, [65, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#F0F2F5", fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: "#FFFFFF", borderRadius: 20, padding: "48px 56px",
        maxWidth: 900, width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        transform: `scale(${0.9 + cardSp * 0.1})`,
        opacity: cardSp,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 20, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>{displayName}</div>
            <div style={{ fontSize: 16, color: textColor, opacity: 0.4 }}>{handle}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 28, color: accentColor, fontWeight: 900 }}>✕</div>
        </div>
        {/* Content */}
        <div style={{
          fontSize: 32, color: textColor, lineHeight: 1.55,
          whiteSpace: "pre-line", opacity: contentOp,
        }}>
          {content}
        </div>
        {/* Stats */}
        <div style={{ marginTop: 32, display: "flex", gap: 40, opacity: statsOp }}>
          <div style={{ fontSize: 20, color: textColor, opacity: 0.5 }}>
            <span style={{ fontWeight: 700, color: textColor, opacity: 1 }}>{reposts}</span> Reposts
          </div>
          <div style={{ fontSize: 20, color: textColor, opacity: 0.5 }}>
            <span style={{ fontWeight: 700, color: textColor, opacity: 1 }}>{likes}</span> Likes
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 30 — Logo Wall

**Category**: E — Quote & Social Proof  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 30: Logo Wall / Brand Trust
// CATEGORY: Quote & Social Proof
// DESCRIPTION: "Trusted by" heading with logo/brand name tiles that fade in staggered
// DIMENSIONS: 1920x1080 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  heading: z.string().default("Trusted by teams at"),
  brands: z.array(z.string()).min(4).max(10).default([
    "Notion", "Linear", "Vercel", "Supabase",
    "Railway", "Stripe", "Loom", "Figma",
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  heading, brands, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headingSp = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 120px" }}>
      <div style={{
        fontSize: 28, color: textColor, opacity: headingOp * 0.45,
        fontWeight: 500, marginBottom: 56, letterSpacing: "0.05em",
        textTransform: "uppercase", transform: `translateY(${(1 - headingSp) * 20}px)`,
      }}>
        {heading}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
        {brands.map((brand, i) => {
          const delay = 20 + i * 12;
          const localFrame = Math.max(0, frame - delay);
          const sp = spring({ fps, frame: localFrame, config: { damping: 16, stiffness: 140 }, durationInFrames: 35 });
          const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              background: "#F8F9FA", borderRadius: 12,
              padding: "20px 40px",
              fontSize: 28, fontWeight: 700, color: textColor, opacity: op * 0.6,
              transform: `scale(${0.85 + sp * 0.15})`,
              letterSpacing: "-0.01em",
            }}>
              {brand}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 31 — Bullet List Reveal

**Category**: F — List & Bullet  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 240 frames (~8s)

```tsx
// ============================================================
// TEMPLATE 31: Bullet List Reveal
// CATEGORY: List & Bullet
// DESCRIPTION: Bulleted list items slide in one by one from left
// DIMENSIONS: 1920x1080 | 30fps | 240 frames (~8s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  heading: z.string().default("Key Takeaways"),
  items: z.array(z.string()).min(2).max(7).default([
    "AI can now generate production-ready video code",
    "Remotion makes React the rendering engine",
    "Templates define the creative constraints",
    "Props schemas enable the form editor",
    "Quality over quantity — 15 great templates beats 100 mediocre ones",
  ]),
  bulletColor: z.string().default("#4F46E5"),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  heading, items, bulletColor, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const framesPerItem = Math.floor(200 / items.length);

  const titleSp = spring({ fps, frame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "72px 160px" }}>
      <div style={{
        fontSize: 52, fontWeight: 800, color: textColor, letterSpacing: "-0.02em",
        marginBottom: 52, opacity: titleOp,
        transform: `translateY(${(1 - titleSp) * 20}px)`,
      }}>
        {heading}
      </div>
      {items.map((item, i) => {
        const delay = 25 + i * framesPerItem;
        const localFrame = Math.max(0, frame - delay);
        const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
        const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", marginBottom: 28,
            opacity: op, transform: `translateX(${(1 - sp) * -40}px)`,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              background: bulletColor, flexShrink: 0,
              marginTop: 12, marginRight: 28,
            }} />
            <div style={{ fontSize: 38, color: textColor, fontWeight: 500, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
              {item}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 32 — Numbered List

**Category**: F — List & Bullet  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 240 frames (~8s)

```tsx
// ============================================================
// TEMPLATE 32: Numbered List
// CATEGORY: List & Bullet
// DESCRIPTION: Ranked numbered list with large number accent, text slides in
// DIMENSIONS: 1920x1080 | 30fps | 240 frames (~8s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  heading: z.string().default("Top 5 Reasons"),
  items: z.array(z.string()).min(2).max(5).default([
    "It saves hours every week",
    "No design skills required",
    "Consistent brand output",
    "Works from a single prompt",
    "Renders in under 3 minutes",
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  heading, items, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const framesPerItem = Math.floor(180 / items.length);
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "64px 120px" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 48, opacity: titleOp }}>{heading}</div>
      {items.map((item, i) => {
        const delay = 20 + i * framesPerItem;
        const localFrame = Math.max(0, frame - delay);
        const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
        const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", marginBottom: 24,
            opacity: op, transform: `translateX(${(1 - sp) * -40}px)`,
          }}>
            <div style={{
              fontSize: 72, fontWeight: 900, color: accentColor,
              lineHeight: 1, width: 100, flexShrink: 0, opacity: 0.9,
            }}>
              {i + 1}
            </div>
            <div style={{ fontSize: 40, color: textColor, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              {item}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 33 — Icon Grid List

**Category**: F — List & Bullet  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 33: Icon Grid List
// CATEGORY: List & Bullet
// DESCRIPTION: 2x grid of feature cards each with emoji icon + title + body
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const FeatureCard = z.object({
  icon: z.string().default("⚡"),
  title: z.string(),
  body: z.string(),
});

export const propsSchema = z.object({
  heading: z.string().default("What You Get"),
  features: z.array(FeatureCard).min(2).max(6).default([
    { icon: "⚡", title: "Lightning Fast", body: "Generate and render in under 3 minutes" },
    { icon: "🎨", title: "50+ Templates", body: "Minimalistic, professional, Google-quality" },
    { icon: "🤖", title: "AI-Powered", body: "Script generation from a single prompt" },
    { icon: "📊", title: "Data-Ready", body: "Charts, graphs, KPIs animated automatically" },
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#F8F9FA"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  heading, features, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "64px 100px" }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 48, opacity: titleOp }}>{heading}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {features.map((feat, i) => {
          const delay = 20 + i * 18;
          const localFrame = Math.max(0, frame - delay);
          const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
          const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              background: "#FFFFFF", borderRadius: 16, padding: "36px 40px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              transform: `translateY(${(1 - sp) * 30}px)`, opacity: op,
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{feat.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: textColor, marginBottom: 10 }}>{feat.title}</div>
              <div style={{ fontSize: 20, color: textColor, opacity: 0.55, lineHeight: 1.5 }}>{feat.body}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 34 — Pros & Cons List

**Category**: F — List & Bullet  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 210 frames (~7s)

```tsx
// ============================================================
// TEMPLATE 34: Pros & Cons List
// CATEGORY: List & Bullet
// DESCRIPTION: Two-column pros vs cons with green check / red cross
// DIMENSIONS: 1920x1080 | 30fps | 210 frames (~7s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  title: z.string().default("Weighing the Options"),
  pros: z.array(z.string()).min(2).max(5).default([
    "Fast to produce content",
    "No technical skills required",
    "Consistent visual quality",
    "Scales with team size",
  ]),
  cons: z.array(z.string()).min(2).max(5).default([
    "Less creative control",
    "Requires good prompts",
    "Template-bound aesthetics",
  ]),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

const ListCol = ({ items, isGood, frame, fps, textColor }: {
  items: string[]; isGood: boolean; frame: number; fps: number; textColor: string;
}) => {
  const color = isGood ? "#059669" : "#DC2626";
  const mark = isGood ? "✓" : "✗";

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
        {isGood ? "Pros" : "Cons"}
      </div>
      {items.map((item, i) => {
        const delay = 25 + i * 20;
        const localFrame = Math.max(0, frame - delay);
        const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });
        const op = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", marginBottom: 20,
            opacity: op, transform: `translateX(${(1 - sp) * (isGood ? -30 : 30)}px)`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: color,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 18, marginRight: 20, flexShrink: 0,
            }}>
              {mark}
            </div>
            <div style={{ fontSize: 28, color: textColor, fontWeight: 400, lineHeight: 1.4 }}>{item}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Animation = ({
  title, pros, cons, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "64px 120px" }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 52, opacity: titleOp }}>{title}</div>
      <div style={{ display: "flex", gap: 80 }}>
        <ListCol items={pros} isGood={true} frame={frame} fps={fps} textColor={textColor} />
        <div style={{ width: 1, background: textColor, opacity: 0.08 }} />
        <ListCol items={cons} isGood={false} frame={frame} fps={fps} textColor={textColor} />
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 35 — Priority Matrix

**Category**: F — List & Bullet  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 35: Priority Matrix (2x2 Grid)
// CATEGORY: List & Bullet
// DESCRIPTION: Eisenhower/impact-effort matrix with items placed in quadrants
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const MatrixItem = z.object({
  label: z.string(),
  quadrant: z.enum(["q1", "q2", "q3", "q4"]),
});

export const propsSchema = z.object({
  title: z.string().default("Priority Matrix"),
  xAxisLabel: z.string().default("Effort"),
  yAxisLabel: z.string().default("Impact"),
  q1Label: z.string().default("Quick Wins"),
  q2Label: z.string().default("Major Projects"),
  q3Label: z.string().default("Fill-ins"),
  q4Label: z.string().default("Thankless Tasks"),
  items: z.array(MatrixItem).min(2).max(8).default([
    { label: "Template Library", quadrant: "q2" },
    { label: "Auth Flow", quadrant: "q1" },
    { label: "Blog posts", quadrant: "q3" },
    { label: "Admin panel", quadrant: "q4" },
    { label: "Script Gen API", quadrant: "q2" },
    { label: "Dark mode", quadrant: "q3" },
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

const QUADRANT_STYLES: Record<string, { bg: string; textColor: string }> = {
  q1: { bg: "#DCFCE7", textColor: "#166534" },
  q2: { bg: "#DBEAFE", textColor: "#1E3A8A" },
  q3: { bg: "#FEF9C3", textColor: "#854D0E" },
  q4: { bg: "#FEE2E2", textColor: "#991B1B" },
};

export const Animation = ({
  title, xAxisLabel, yAxisLabel, q1Label, q2Label, q3Label, q4Label,
  items, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const gridOp = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const quadLabels = { q1: q1Label, q2: q2Label, q3: q3Label, q4: q4Label };
  const quadrantItems: Record<string, string[]> = { q1: [], q2: [], q3: [], q4: [] };
  items.forEach(it => quadrantItems[it.quadrant].push(it.label));

  const renderQuadrant = (key: string, itemList: string[], index: number) => {
    const qs = QUADRANT_STYLES[key];
    const delay = 35 + index * 15;
    const localFrame = Math.max(0, frame - delay);
    const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
    const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

    return (
      <div style={{
        flex: 1, background: qs.bg, borderRadius: 12, padding: "20px 24px",
        transform: `scale(${0.9 + sp * 0.1})`, opacity: op,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: qs.textColor, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {quadLabels[key as keyof typeof quadLabels]}
        </div>
        {itemList.map((item, i) => (
          <div key={i} style={{ fontSize: 18, color: qs.textColor, marginBottom: 8, opacity: 0.8 }}>• {item}</div>
        ))}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "52px 100px" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 24, opacity: titleOp }}>{title}</div>
      {/* Axis labels */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, opacity: gridOp }}>
        <div style={{ fontSize: 16, color: textColor, opacity: 0.35, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          ← Low {xAxisLabel} — High {xAxisLabel} →
        </div>
      </div>
      {/* Matrix grid */}
      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        <div style={{ fontSize: 14, color: textColor, opacity: 0.35, writingMode: "vertical-rl", textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "center", transform: "rotate(180deg)" }}>
          ↑ High {yAxisLabel} ↓
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12 }}>
          {renderQuadrant("q2", quadrantItems.q2, 0)}
          {renderQuadrant("q1", quadrantItems.q1, 1)}
          {renderQuadrant("q4", quadrantItems.q4, 2)}
          {renderQuadrant("q3", quadrantItems.q3, 3)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 36 — Feature Spotlight

**Category**: G — Comparison & Feature  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 36: Feature Spotlight
// CATEGORY: Comparison & Feature
// DESCRIPTION: Single product feature with icon, headline, and 3 sub-points
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  icon: z.string().default("🚀"),
  featureName: z.string().default("AI Script Generation"),
  tagline: z.string().default("From prompt to polished script in seconds"),
  points: z.array(z.string()).min(2).max(4).default([
    "Structured JSON output — validated with Zod",
    "Scene-by-scene breakdown with timing hints",
    "Retry-once on failure with fallback model",
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  icon, featureName, tagline, points, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconSp = spring({ fps, frame, config: { damping: 10, stiffness: 80 }, durationInFrames: 40 });
  const titleOp = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [20, 50], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 160px" }}>
      <div style={{ fontSize: 80, transform: `scale(${iconSp})`, marginBottom: 28 }}>{icon}</div>
      <div style={{
        fontSize: 72, fontWeight: 800, color: textColor,
        letterSpacing: "-0.03em", lineHeight: 1.1,
        opacity: titleOp, transform: `translateY(${titleY}px)`, marginBottom: 16,
      }}>
        {featureName}
      </div>
      <div style={{
        fontSize: 32, color: textColor, opacity: titleOp * 0.5,
        fontWeight: 300, marginBottom: 48, transform: `translateY(${titleY}px)`,
      }}>
        {tagline}
      </div>
      {points.map((pt, i) => {
        const delay = 55 + i * 18;
        const localFrame = Math.max(0, frame - delay);
        const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 35 });
        const op = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", marginBottom: 16,
            opacity: op, transform: `translateX(${(1 - sp) * -30}px)`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, marginRight: 20, flexShrink: 0 }} />
            <div style={{ fontSize: 28, color: textColor, opacity: 0.7, fontWeight: 400 }}>{pt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 37 — Pricing Tiers

**Category**: G — Comparison & Feature  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 37: Pricing Tiers
// CATEGORY: Comparison & Feature
// DESCRIPTION: Free vs Pro pricing cards with features list and CTA
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const TierItem = z.object({
  name: z.string(),
  price: z.string(),
  period: z.string().default("/mo"),
  features: z.array(z.string()),
  highlighted: z.boolean().default(false),
  cta: z.string().default("Get Started"),
});

export const propsSchema = z.object({
  heading: z.string().default("Simple Pricing"),
  tiers: z.array(TierItem).min(2).max(3).default([
    {
      name: "Free", price: "$0", period: "/mo",
      features: ["5 renders/month", "720p output", "Watermark", "All templates"],
      highlighted: false, cta: "Start Free",
    },
    {
      name: "Pro", price: "$15", period: "/mo",
      features: ["Unlimited renders", "1080p output", "No watermark", "Brand kit", "Priority render"],
      highlighted: true, cta: "Go Pro",
    },
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#F8F9FA"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  heading, tiers, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "64px 120px" }}>
      <div style={{ fontSize: 52, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 56, textAlign: "center", opacity: titleOp }}>
        {heading}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
        {tiers.map((tier, i) => {
          const delay = 20 + i * 25;
          const localFrame = Math.max(0, frame - delay);
          const sp = spring({ fps, frame: localFrame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
          const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              width: 420, background: tier.highlighted ? accentColor : "#FFFFFF",
              borderRadius: 20, padding: "48px 44px",
              boxShadow: tier.highlighted ? `0 16px 64px ${accentColor}40` : "0 4px 24px rgba(0,0,0,0.06)",
              transform: `translateY(${(1 - sp) * 40}px) ${tier.highlighted ? "scale(1.04)" : ""}`,
              opacity: op,
            }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: tier.highlighted ? "rgba(255,255,255,0.7)" : textColor, opacity: tier.highlighted ? 1 : 0.5, marginBottom: 8 }}>
                {tier.name}
              </div>
              <div style={{ fontSize: 64, fontWeight: 900, color: tier.highlighted ? "#FFFFFF" : textColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {tier.price}
                <span style={{ fontSize: 22, fontWeight: 400, opacity: 0.5 }}>{tier.period}</span>
              </div>
              <div style={{ height: 1, background: tier.highlighted ? "rgba(255,255,255,0.2)" : "#E5E7EB", margin: "24px 0" }} />
              {tier.features.map((f, fi) => (
                <div key={fi} style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ color: tier.highlighted ? "rgba(255,255,255,0.8)" : "#059669", marginRight: 12, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 18, color: tier.highlighted ? "#FFFFFF" : textColor, opacity: tier.highlighted ? 0.85 : 0.7 }}>{f}</span>
                </div>
              ))}
              <div style={{
                marginTop: 28, background: tier.highlighted ? "#FFFFFF" : accentColor,
                color: tier.highlighted ? accentColor : "#FFFFFF",
                borderRadius: 10, padding: "14px 24px", textAlign: "center",
                fontSize: 18, fontWeight: 700,
              }}>
                {tier.cta}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 38 — Split Feature Showcase

**Category**: G — Comparison & Feature  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 38: Split Feature Showcase
// CATEGORY: Comparison & Feature
// DESCRIPTION: Left text content + right mock UI card, both animate in from sides
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  label: z.string().default("NEW FEATURE"),
  title: z.string().default("Real-time Preview"),
  description: z.string().default("See your video update live as you change props in the form editor. No re-render required for previews."),
  bulletPoints: z.array(z.string()).default(["Instant Remotion Player preview", "JSON Schema → dynamic form", "Live prop binding"]),
  mockTitle: z.string().default("Script Editor"),
  mockLines: z.array(z.string()).default(["Scene 1: Title Card", "Scene 2: Key Point A", "Scene 3: Chart"]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  label, title, description, bulletPoints, mockTitle, mockLines,
  accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSp = spring({ fps, frame, config: { damping: 18, stiffness: 110 }, durationInFrames: 45 });
  const rightSp = spring({ fps, frame: Math.max(0, frame - 15), config: { damping: 18, stiffness: 110 }, durationInFrames: 45 });
  const bulletOp = (i: number) => interpolate(Math.max(0, frame - (50 + i * 15)), [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "row", alignItems: "center", padding: "0 80px", gap: 80 }}>
      {/* Left */}
      <div style={{ flex: 1, opacity: leftSp, transform: `translateX(${(1 - leftSp) * -60}px)` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: accentColor, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{label}</div>
        <div style={{ fontSize: 60, fontWeight: 800, color: textColor, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24 }}>{title}</div>
        <div style={{ fontSize: 26, color: textColor, opacity: 0.55, lineHeight: 1.6, marginBottom: 36 }}>{description}</div>
        {bulletPoints.map((bp, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 14, opacity: bulletOp(i) }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: accentColor, marginRight: 16 }} />
            <div style={{ fontSize: 22, color: textColor, fontWeight: 500 }}>{bp}</div>
          </div>
        ))}
      </div>
      {/* Right — mock UI */}
      <div style={{ flex: 1, opacity: rightSp, transform: `translateX(${(1 - rightSp) * 60}px)` }}>
        <div style={{ background: "#0F172A", borderRadius: 16, padding: "32px 36px", boxShadow: "0 16px 64px rgba(0,0,0,0.15)" }}>
          {/* Mock title bar */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
            <div style={{ marginLeft: 16, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{mockTitle}</div>
          </div>
          {mockLines.map((line, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "16px 20px",
              marginBottom: 12, fontSize: 18, color: "rgba(255,255,255,0.7)",
              borderLeft: `3px solid ${accentColor}`,
            }}>
              {line}
            </div>
          ))}
          <div style={{ marginTop: 20, background: accentColor, borderRadius: 8, padding: "12px 24px", textAlign: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>
            ▶ Preview
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 39 — Stack Comparison

**Category**: G — Comparison & Feature  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 39: Tech Stack Comparison
// CATEGORY: Comparison & Feature
// DESCRIPTION: Visual stack layout showing technologies with category labels
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const StackLayer = z.object({
  category: z.string(),
  items: z.array(z.string()),
  color: z.string(),
});

export const propsSchema = z.object({
  title: z.string().default("Nex Tech Stack"),
  layers: z.array(StackLayer).min(2).max(7).default([
    { category: "Frontend", items: ["Next.js 14", "TypeScript", "Tailwind CSS"], color: "#4F46E5" },
    { category: "Video", items: ["Remotion 4.x", "renderMedia()"], color: "#7C3AED" },
    { category: "AI", items: ["Groq API", "Qwen2.5-Coder", "Claude Sonnet"], color: "#059669" },
    { category: "Backend", items: ["Next.js API", "tRPC", "BullMQ"], color: "#F59E0B" },
    { category: "Infrastructure", items: ["Railway", "Supabase", "Cloudflare R2"], color: "#0284C7" },
  ]),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  title, layers, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "64px 100px" }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 48, opacity: titleOp }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {layers.map((layer, i) => {
          const delay = 20 + i * 18;
          const localFrame = Math.max(0, frame - delay);
          const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
          const op = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 24,
              opacity: op, transform: `translateX(${(1 - sp) * -40}px)`,
            }}>
              <div style={{
                width: 160, fontSize: 14, fontWeight: 700, color: layer.color,
                textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0,
              }}>
                {layer.category}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {layer.items.map((item, j) => (
                  <div key={j} style={{
                    background: layer.color + "20",
                    border: `1px solid ${layer.color}50`,
                    borderRadius: 8, padding: "10px 20px",
                    fontSize: 18, fontWeight: 600, color: textColor,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 40 — Side-by-Side Code

**Category**: G — Comparison & Feature  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 40: Side-by-Side Code Comparison
// CATEGORY: Comparison & Feature
// DESCRIPTION: Two code blocks shown side by side — before/after or A/B patterns
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Roboto_Mono";

const { fontFamily: monoFont } = loadFont();
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadInter();

export const propsSchema = z.object({
  title: z.string().default("Cleaner Animation Pattern"),
  leftLabel: z.string().default("❌ Don't"),
  leftCode: z.string().default(`// Using useState — WRONG
const [x, setX] = useState(0);
useEffect(() => {
  const id = setInterval(() =>
    setX(v => v + 1), 16);
  return () => clearInterval(id);
}, []);`),
  rightLabel: z.string().default("✅ Do"),
  rightCode: z.string().default(`// Using interpolate — CORRECT
const frame = useCurrentFrame();
const x = interpolate(
  frame, [0, 60], [0, 300],
  { extrapolateRight: "clamp" }
);`),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
  accentColor: z.string().default("#4F46E5"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  title, leftLabel, leftCode, rightLabel, rightCode, background, textColor, accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const leftSp = spring({ fps, frame: Math.max(0, frame - 15), config: { damping: 18, stiffness: 110 }, durationInFrames: 40 });
  const rightSp = spring({ fps, frame: Math.max(0, frame - 30), config: { damping: 18, stiffness: 110 }, durationInFrames: 40 });

  const CodeBlock = ({ label, code, sp, bad }: { label: string; code: string; sp: number; bad?: boolean }) => (
    <div style={{ flex: 1, opacity: sp, transform: `translateY(${(1 - sp) * 30}px)` }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: bad ? "#EF4444" : "#10B981" }}>{label}</div>
      <div style={{
        background: "#1E293B", borderRadius: 12, padding: "28px 32px",
        borderLeft: `4px solid ${bad ? "#EF4444" : "#10B981"}`,
      }}>
        <pre style={{ fontFamily: monoFont, fontSize: 18, color: "#E2E8F0", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
          {code}
        </pre>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "60px 80px" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 40, opacity: titleOp }}>{title}</div>
      <div style={{ display: "flex", gap: 32 }}>
        <CodeBlock label={leftLabel} code={leftCode} sp={leftSp} bad />
        <CodeBlock label={rightLabel} code={rightCode} sp={rightSp} />
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 41 — CTA Outro

**Category**: H — CTA & Outro  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 41: Call-to-Action Outro
// CATEGORY: CTA & Outro
// DESCRIPTION: Clean dark outro with main CTA, URL, and social handle
// DIMENSIONS: 1920x1080 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  headline: z.string().default("Start creating today"),
  subtext: z.string().default("Join 12,000+ creators who ship with Nex"),
  ctaText: z.string().default("Try it free →"),
  url: z.string().default("nex.video"),
  handle: z.string().default("@nexvideo"),
  accentColor: z.string().default("#C8FA64"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  headline, subtext, ctaText, url, handle, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const subtextOp = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaSp = spring({ fps, frame: Math.max(0, frame - 45), config: { damping: 14, stiffness: 120 }, durationInFrames: 40 });
  const bottomOp = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        fontSize: 96, fontWeight: 900, color: textColor, letterSpacing: "-0.04em", lineHeight: 1.05,
        textAlign: "center", transform: `translateY(${(1 - headlineSp) * 40}px)`, opacity: headlineSp,
      }}>
        {headline}
      </div>
      <div style={{ fontSize: 30, color: textColor, opacity: subtextOp * 0.5, marginTop: 20, fontWeight: 400 }}>
        {subtext}
      </div>
      <div style={{
        marginTop: 48, background: accentColor, color: "#0F172A",
        borderRadius: 14, padding: "20px 52px",
        fontSize: 28, fontWeight: 800,
        transform: `scale(${0.9 + ctaSp * 0.1})`, opacity: ctaSp,
      }}>
        {ctaText}
      </div>
      <div style={{ marginTop: 60, display: "flex", gap: 48, opacity: bottomOp }}>
        <div style={{ fontSize: 20, color: textColor, opacity: 0.4, fontWeight: 500 }}>{url}</div>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: textColor, opacity: 0.2, alignSelf: "center" }} />
        <div style={{ fontSize: 20, color: textColor, opacity: 0.4, fontWeight: 500 }}>{handle}</div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 42 — Subscribe Card (9:16 Vertical)

**Category**: H — CTA & Outro  
**File**: `Animation.tsx`  
**Dimensions**: 1080×1920 | 30fps | 120 frames (~4s)

```tsx
// ============================================================
// TEMPLATE 42: Subscribe Card — Vertical (Shorts/Reels)
// CATEGORY: CTA & Outro
// DESCRIPTION: Full-screen vertical subscribe CTA for YouTube Shorts / Instagram Reels
// DIMENSIONS: 1080x1920 | 30fps | 120 frames (~4s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  emoji: z.string().default("🔔"),
  headline: z.string().default("Subscribe for more"),
  subtext: z.string().default("New videos every week"),
  channelName: z.string().default("@YourChannel"),
  accentColor: z.string().default("#FF0000"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  emoji, headline, subtext, channelName, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiSp = spring({ fps, frame, config: { damping: 10, stiffness: 80 }, durationInFrames: 35 });
  const headSp = spring({ fps, frame: Math.max(0, frame - 15), config: { damping: 16, stiffness: 110 }, durationInFrames: 40 });
  const btnSp = spring({ fps, frame: Math.max(0, frame - 40), config: { damping: 14, stiffness: 120 }, durationInFrames: 35 });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ fontSize: 120, transform: `scale(${emojiSp})`, marginBottom: 32 }}>{emoji}</div>
      <div style={{
        fontSize: 72, fontWeight: 900, color: textColor, textAlign: "center",
        letterSpacing: "-0.03em", lineHeight: 1.1,
        transform: `translateY(${(1 - headSp) * 40}px)`, opacity: headSp, marginBottom: 16,
      }}>
        {headline}
      </div>
      <div style={{ fontSize: 32, color: textColor, opacity: 0.5, marginBottom: 56 }}>{subtext}</div>
      <div style={{
        background: accentColor, borderRadius: 16, padding: "24px 64px",
        fontSize: 32, fontWeight: 800, color: "#fff",
        transform: `scale(${0.9 + btnSp * 0.1})`, opacity: btnSp,
      }}>
        Subscribe
      </div>
      <div style={{ marginTop: 32, fontSize: 24, color: textColor, opacity: 0.35 }}>{channelName}</div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 43 — End Screen (Lower Third)

**Category**: H — CTA & Outro  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 120 frames (~4s)

```tsx
// ============================================================
// TEMPLATE 43: Lower Third End Screen
// CATEGORY: CTA & Outro
// DESCRIPTION: Animated lower-third bar with brand + CTA link
// DIMENSIONS: 1920x1080 | 30fps | 120 frames (~4s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  brandName: z.string().default("Nex"),
  tagline: z.string().default("AI video generation platform"),
  cta: z.string().default("nex.video — Try free"),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("transparent"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  brandName, tagline, cta, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barW = interpolate(frame, [0, 40], [0, 1920], {
    extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const contentOp = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const contentY = spring({ fps, frame: Math.max(0, frame - 25), config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{ fontFamily, background: background === "transparent" ? "transparent" : background }}>
      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, width: barW, height: 110,
        background: accentColor,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 64px",
      }}>
        <div style={{ opacity: contentOp, transform: `translateY(${(1 - contentY) * 16}px)` }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.01em" }}>{brandName}</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{tagline}</div>
        </div>
        <div style={{ opacity: contentOp, transform: `translateY(${(1 - contentY) * 16}px)`, fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 44 — Thank You Card

**Category**: H — CTA & Outro  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 120 frames (~4s)

```tsx
// ============================================================
// TEMPLATE 44: Thank You Card
// CATEGORY: CTA & Outro
// DESCRIPTION: Minimal closing slide with thank you message + brand
// DIMENSIONS: 1920x1080 | 30fps | 120 frames (~4s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  message: z.string().default("Thank you for watching"),
  brand: z.string().default("Nex"),
  tagline: z.string().default("Create. Animate. Share."),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  message, brand, tagline, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msgSp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 40 });
  const brandOp = interpolate(frame, [35, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [20, 60], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 48, color: textColor, opacity: msgSp * 0.45, fontWeight: 400, marginBottom: 24, letterSpacing: "0.05em" }}>
        {message}
      </div>
      <div style={{ fontSize: 120, fontWeight: 900, color: textColor, letterSpacing: "-0.05em", transform: `scale(${0.8 + msgSp * 0.2})`, opacity: msgSp }}>
        {brand}
      </div>
      <div style={{ width: lineW, height: 4, background: accentColor, borderRadius: 2, margin: "16px 0" }} />
      <div style={{ fontSize: 22, color: textColor, opacity: brandOp * 0.35, letterSpacing: "0.1em", textTransform: "uppercase" }}>{tagline}</div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 45 — Countdown Timer

**Category**: H — CTA & Outro  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 90 frames (~3s)

```tsx
// ============================================================
// TEMPLATE 45: Countdown Timer
// CATEGORY: CTA & Outro
// DESCRIPTION: 3-2-1 countdown with circular progress ring and pulse
// DIMENSIONS: 1920x1080 | 30fps | 90 frames (~3s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame,
  interpolate, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  startCount: z.number().int().min(1).max(9).default(3),
  label: z.string().default("Starting in"),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  startCount, label, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const framesPerCount = 30;
  const currentCount = startCount - Math.floor(frame / framesPerCount);
  const localFrame = frame % framesPerCount;

  const progress = interpolate(localFrame, [0, framesPerCount - 2], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const scale = interpolate(localFrame, [0, 8, framesPerCount - 2], [1.15, 1, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const r = 160;
  const circ = 2 * Math.PI * r;

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 22, color: textColor, opacity: 0.4, marginBottom: 32, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ position: "relative", width: 400, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={400} height={400} style={{ position: "absolute" }}>
          <circle cx={200} cy={200} r={r} fill="none" stroke={textColor} strokeOpacity={0.08} strokeWidth={12} />
          <circle cx={200} cy={200} r={r} fill="none" stroke={accentColor} strokeWidth={12}
            strokeDasharray={`${progress * circ} ${circ}`}
            strokeDashoffset={0}
            transform="rotate(-90 200 200)"
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          fontSize: 160, fontWeight: 900, color: textColor, lineHeight: 1,
          transform: `scale(${scale})`,
        }}>
          {Math.max(0, currentCount)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 46 — Product Demo Flow

**Category**: B — Text & Explainer  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 300 frames (~10s)

```tsx
// ============================================================
// TEMPLATE 46: Product Demo Flow
// CATEGORY: Text & Explainer
// DESCRIPTION: 5-step user journey (Step 1 → 5) with progress indicator
// DIMENSIONS: 1920x1080 | 30fps | 300 frames (~10s)
// ============================================================

import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const StepItem = z.object({ step: z.string(), title: z.string(), detail: z.string() });

export const propsSchema = z.object({
  steps: z.array(StepItem).min(3).max(5).default([
    { step: "01", title: "Enter your prompt", detail: "Type what you want the video to explain" },
    { step: "02", title: "Review the script", detail: "AI structures it into scenes automatically" },
    { step: "03", title: "Approve & render", detail: "One click starts the render pipeline" },
    { step: "04", title: "Watch progress", detail: "Real-time status while Remotion renders" },
    { step: "05", title: "Download & share", detail: "1080p MP4 ready for any platform" },
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

const StepScene = ({
  step, stepIndex, total, accentColor, textColor, background,
}: { step: z.infer<typeof StepItem>; stepIndex: number; total: number; accentColor: string; textColor: string; background: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const detailOp = interpolate(frame, [25, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 160px" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 12, marginBottom: 64 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            width: i === stepIndex ? 32 : 10, height: 10, borderRadius: 5,
            background: i <= stepIndex ? accentColor : "#E5E7EB",
            transition: "none",
            opacity: i <= stepIndex ? 1 : 0.4,
          }} />
        ))}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accentColor, letterSpacing: "0.1em", marginBottom: 16, opacity: sp }}>
        STEP {step.step}
      </div>
      <div style={{
        fontSize: 80, fontWeight: 800, color: textColor, lineHeight: 1.1,
        letterSpacing: "-0.03em", marginBottom: 28,
        transform: `translateY(${(1 - sp) * 40}px)`, opacity: sp,
      }}>
        {step.title}
      </div>
      <div style={{ fontSize: 36, color: textColor, opacity: detailOp * 0.55, fontWeight: 400, maxWidth: 800 }}>
        {step.detail}
      </div>
    </AbsoluteFill>
  );
};

export const Animation = ({ steps, accentColor, background, textColor }) => {
  const framesPerStep = Math.floor(300 / steps.length);

  return (
    <AbsoluteFill>
      {steps.map((step, i) => (
        <Sequence key={i} from={i * framesPerStep} durationInFrames={framesPerStep}>
          <StepScene
            step={step} stepIndex={i} total={steps.length}
            accentColor={accentColor} textColor={textColor} background={background}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 47 — Vertical Short — Tip Card (9:16)

**Category**: B — Text & Explainer  
**File**: `Animation.tsx`  
**Dimensions**: 1080×1920 | 30fps | 150 frames (~5s)

```tsx
// ============================================================
// TEMPLATE 47: Vertical Tip Card (9:16)
// CATEGORY: Text & Explainer
// DESCRIPTION: Single tip or fact formatted for Instagram/TikTok/Shorts
// DIMENSIONS: 1080x1920 | 30fps | 150 frames (~5s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  eyebrow: z.string().default("💡 Quick Tip"),
  tip: z.string().default("Always validate generated code before rendering — a 10-frame dry run catches 80% of errors before full render."),
  source: z.string().default("Nex Engineering"),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  eyebrow, tip, source, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topSp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 40 });
  const tipOp = interpolate(frame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tipY = interpolate(frame, [20, 55], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
  const sourceOp = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px" }}>
      <div style={{
        fontSize: 36, fontWeight: 700, color: accentColor, marginBottom: 40,
        transform: `translateY(${(1 - topSp) * -20}px)`, opacity: topSp,
      }}>
        {eyebrow}
      </div>
      <div style={{
        fontSize: 54, fontWeight: 700, color: textColor, lineHeight: 1.4,
        letterSpacing: "-0.02em",
        opacity: tipOp, transform: `translateY(${tipY}px)`,
        borderLeft: `6px solid ${accentColor}`, paddingLeft: 32,
      }}>
        {tip}
      </div>
      <div style={{ marginTop: 48, fontSize: 24, color: textColor, opacity: sourceOp * 0.35 }}>— {source}</div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 48 — Map / Geography Callout

**Category**: C — Data & Charts  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 48: Region / Market Callout
// CATEGORY: Data & Charts
// DESCRIPTION: Text-based region stats layout (no SVG map needed) with animated cards
// DIMENSIONS: 1920x1080 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const RegionItem = z.object({ region: z.string(), value: z.string(), detail: z.string(), flag: z.string().default("🌍") });

export const propsSchema = z.object({
  title: z.string().default("Global Reach"),
  regions: z.array(RegionItem).min(2).max(6).default([
    { region: "North America", value: "42%", detail: "Largest market", flag: "🇺🇸" },
    { region: "Europe", value: "28%", detail: "Fast growing", flag: "🇪🇺" },
    { region: "Asia Pacific", value: "20%", detail: "Emerging segment", flag: "🌏" },
    { region: "Rest of World", value: "10%", detail: "Untapped potential", flag: "🌍" },
  ]),
  accentColor: z.string().default("#4F46E5"),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  title, regions, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "64px 100px" }}>
      <div style={{ fontSize: 52, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 56, opacity: titleOp }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
        {regions.map((region, i) => {
          const delay = 20 + i * 20;
          const localFrame = Math.max(0, frame - delay);
          const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
          const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              background: "#F8F9FA", borderRadius: 16, padding: "32px 36px",
              display: "flex", alignItems: "center", gap: 24,
              transform: `translateY(${(1 - sp) * 30}px)`, opacity: op,
            }}>
              <div style={{ fontSize: 48, flexShrink: 0 }}>{region.flag}</div>
              <div>
                <div style={{ fontSize: 18, color: textColor, opacity: 0.45, fontWeight: 500, marginBottom: 4 }}>{region.region}</div>
                <div style={{ fontSize: 52, fontWeight: 900, color: accentColor, lineHeight: 1, letterSpacing: "-0.03em" }}>{region.value}</div>
                <div style={{ fontSize: 18, color: textColor, opacity: 0.4, marginTop: 4 }}>{region.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 49 — Stacked Area Chart

**Category**: C — Data & Charts  
**File**: `Animation.tsx`  
**Dimensions**: 1920×1080 | 30fps | 210 frames (~7s)

```tsx
// ============================================================
// TEMPLATE 49: Stacked Area Chart
// CATEGORY: Data & Charts
// DESCRIPTION: Two data series rendered as stacked areas with SVG animation
// DIMENSIONS: 1920x1080 | 30fps | 210 frames (~7s)
// ============================================================

import { useMemo } from "react";
import {
  AbsoluteFill, useCurrentFrame,
  interpolate, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const propsSchema = z.object({
  title: z.string().default("Revenue vs. Cost"),
  series: z.array(z.object({
    name: z.string(),
    color: z.string(),
    values: z.array(z.number()),
  })).min(1).max(2).default([
    { name: "Revenue", color: "#4F46E5", values: [10, 25, 38, 52, 71, 89, 110, 135] },
    { name: "Cost", color: "#F59E0B", values: [18, 22, 26, 30, 35, 40, 48, 55] },
  ]),
  xLabels: z.array(z.string()).default(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]),
  background: z.string().default("#FFFFFF"),
  textColor: z.string().default("#0F172A"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  title, series, xLabels, background, textColor,
}) => {
  const frame = useCurrentFrame();

  const svgW = 1600, svgH = 580;
  const padL = 60, padR = 40, padT = 30, padB = 50;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allValues = series.flatMap(s => s.values);
  const maxVal = useMemo(() => Math.max(...allValues) * 1.1, [allValues]);
  const n = xLabels.length;

  const progress = interpolate(frame, [20, 160], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const getX = (i: number) => padL + (i / (n - 1)) * plotW;
  const getY = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const buildArea = (values: number[]) => {
    const visibleCount = Math.max(2, Math.round(progress * (n - 1)) + 1);
    const pts = values.slice(0, visibleCount);
    const line = pts.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
    const area = `${padL},${padT + plotH} ${line} ${getX(visibleCount - 1)},${padT + plotH}`;
    return { line, area };
  };

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const legendOp = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background, fontFamily, padding: "52px 80px" }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", marginBottom: 8, opacity: titleOp }}>{title}</div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 32, marginBottom: 16, opacity: legendOp }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: s.color }} />
            <div style={{ fontSize: 18, color: textColor, opacity: 0.6 }}>{s.name}</div>
          </div>
        ))}
      </div>
      <svg width={svgW} height={svgH}>
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={padL} y1={padT + plotH * (1 - f)} x2={padL + plotW} y2={padT + plotH * (1 - f)}
            stroke={textColor} strokeOpacity={0.06} strokeWidth={1} />
        ))}
        {/* Series */}
        {series.map((s, i) => {
          const { line, area } = buildArea(s.values);
          return (
            <g key={i}>
              <polygon points={area} fill={s.color} opacity={0.12} />
              <polyline points={line} fill="none" stroke={s.color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {/* X labels */}
        {xLabels.map((lbl, i) => (
          <text key={i} x={getX(i)} y={padT + plotH + 36} textAnchor="middle" fontSize={18} fill={textColor} opacity={0.35} fontFamily={fontFamily}>{lbl}</text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

### TEMPLATE 50 — Vertical Outro with Stats (9:16)

**Category**: H — CTA & Outro  
**File**: `Animation.tsx`  
**Dimensions**: 1080×1920 | 30fps | 180 frames (~6s)

```tsx
// ============================================================
// TEMPLATE 50: Vertical Outro with Stats (9:16)
// CATEGORY: CTA & Outro
// DESCRIPTION: Portrait-format closing slide with 3 stats + CTA for social video
// DIMENSIONS: 1080x1920 | 30fps | 180 frames (~6s)
// ============================================================

import {
  AbsoluteFill, useCurrentFrame, useVideoConfig,
  interpolate, spring, Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const StatItem = z.object({ value: z.string(), label: z.string() });

export const propsSchema = z.object({
  headline: z.string().default("The numbers speak"),
  stats: z.array(StatItem).min(2).max(3).default([
    { value: "3 min", label: "Average render time" },
    { value: "50+", label: "Templates available" },
    { value: "1080p", label: "Output quality" },
  ]),
  cta: z.string().default("Try Nex free"),
  url: z.string().default("nex.video"),
  accentColor: z.string().default("#C8FA64"),
  background: z.string().default("#0F172A"),
  textColor: z.string().default("#FFFFFF"),
});
export type Props = z.infer<typeof propsSchema>;

export const Animation = ({
  headline, stats, cta, url, accentColor, background, textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headSp = spring({ fps, frame, config: { damping: 16, stiffness: 100 }, durationInFrames: 45 });
  const ctaSp = spring({ fps, frame: Math.max(0, frame - 90), config: { damping: 14, stiffness: 120 }, durationInFrames: 40 });
  const urlOp = interpolate(frame, [110, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background, fontFamily,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "100px 64px",
    }}>
      <div style={{
        fontSize: 64, fontWeight: 900, color: textColor, textAlign: "center",
        letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 72,
        transform: `translateY(${(1 - headSp) * 40}px)`, opacity: headSp,
      }}>
        {headline}
      </div>
      {/* Stats */}
      {stats.map((stat, i) => {
        const delay = 25 + i * 22;
        const localFrame = Math.max(0, frame - delay);
        const sp = spring({ fps, frame: localFrame, config: { damping: 18, stiffness: 120 }, durationInFrames: 40 });
        const op = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 16,
            padding: "28px 40px", marginBottom: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transform: `translateX(${(1 - sp) * -40}px)`, opacity: op,
          }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: accentColor, letterSpacing: "-0.02em" }}>{stat.value}</div>
            <div style={{ fontSize: 22, color: textColor, opacity: 0.5, textAlign: "right", maxWidth: 260 }}>{stat.label}</div>
          </div>
        );
      })}
      {/* CTA button */}
      <div style={{
        marginTop: 52, background: accentColor, borderRadius: 16,
        padding: "24px 72px", fontSize: 30, fontWeight: 800, color: "#0F172A",
        transform: `scale(${0.9 + ctaSp * 0.1})`, opacity: ctaSp,
      }}>
        {cta}
      </div>
      <div style={{ marginTop: 24, fontSize: 22, color: textColor, opacity: urlOp * 0.35 }}>{url}</div>
    </AbsoluteFill>
  );
};

export default Animation;
```

---

## ━━━ TEMPLATE INDEX ━━━

| # | Name | Category | Dims | Duration |
|---|------|----------|------|----------|
| 01 | Clean Title Intro | A — Intro | 1920×1080 | 150f / 5s |
| 02 | Dark Hero Intro | A — Intro | 1920×1080 | 150f / 5s |
| 03 | Split Screen Title | A — Intro | 1920×1080 | 150f / 5s |
| 04 | Kinetic Word Intro | A — Intro | 1920×1080 | 180f / 6s |
| 05 | Logo Reveal | A — Intro | 1920×1080 | 120f / 4s |
| 06 | Chapter Card | A — Intro | 1920×1080 | 120f / 4s |
| 07 | Gradient Orb Title | A — Intro | 1920×1080 | 150f / 5s |
| 08 | Three-Point Explainer | B — Text | 1920×1080 | 270f / 9s |
| 09 | Definition Card | B — Text | 1920×1080 | 150f / 5s |
| 10 | Step-by-Step Process | B — Text | 1920×1080 | 240f / 8s |
| 11 | Big Fact Reveal | B — Text | 1920×1080 | 150f / 5s |
| 12 | Concept Breakdown | B — Text | 1920×1080 | 210f / 7s |
| 13 | Scrolling Explainer | B — Text | 1920×1080 | 300f / 10s |
| 14 | Before/After Reveal | B — Text | 1920×1080 | 180f / 6s |
| 15 | Animated Bar Chart | C — Data | 1920×1080 | 180f / 6s |
| 16 | Animated Donut Chart | C — Data | 1920×1080 | 180f / 6s |
| 17 | Line Graph | C — Data | 1920×1080 | 210f / 7s |
| 18 | KPI Dashboard | C — Data | 1920×1080 | 150f / 5s |
| 19 | Progress Tracker | C — Data | 1920×1080 | 150f / 5s |
| 20 | Scatter Plot | C — Data | 1920×1080 | 180f / 6s |
| 21 | Horizontal Timeline | D — Timeline | 1920×1080 | 240f / 8s |
| 22 | Product Roadmap | D — Timeline | 1920×1080 | 210f / 7s |
| 23 | Funnel Chart | D — Timeline | 1920×1080 | 210f / 7s |
| 24 | Gantt Sprint Plan | D — Timeline | 1920×1080 | 180f / 6s |
| 25 | Comparison Table | G — Comparison | 1920×1080 | 180f / 6s |
| 26 | Pull Quote Card | E — Quote | 1920×1080 | 150f / 5s |
| 27 | Testimonial Card | E — Quote | 1920×1080 | 150f / 5s |
| 28 | Social Proof Numbers | E — Quote | 1920×1080 | 150f / 5s |
| 29 | Tweet / Post Card | E — Quote | 1920×1080 | 150f / 5s |
| 30 | Logo Wall | E — Quote | 1920×1080 | 150f / 5s |
| 31 | Bullet List Reveal | F — List | 1920×1080 | 240f / 8s |
| 32 | Numbered List | F — List | 1920×1080 | 240f / 8s |
| 33 | Icon Grid List | F — List | 1920×1080 | 180f / 6s |
| 34 | Pros & Cons List | F — List | 1920×1080 | 210f / 7s |
| 35 | Priority Matrix | F — List | 1920×1080 | 180f / 6s |
| 36 | Feature Spotlight | G — Comparison | 1920×1080 | 180f / 6s |
| 37 | Pricing Tiers | G — Comparison | 1920×1080 | 180f / 6s |
| 38 | Split Feature Showcase | G — Comparison | 1920×1080 | 180f / 6s |
| 39 | Tech Stack Comparison | G — Comparison | 1920×1080 | 180f / 6s |
| 40 | Side-by-Side Code | G — Comparison | 1920×1080 | 180f / 6s |
| 41 | CTA Outro | H — CTA | 1920×1080 | 150f / 5s |
| 42 | Subscribe Card (9:16) | H — CTA | 1080×1920 | 120f / 4s |
| 43 | Lower Third End Screen | H — CTA | 1920×1080 | 120f / 4s |
| 44 | Thank You Card | H — CTA | 1920×1080 | 120f / 4s |
| 45 | Countdown Timer | H — CTA | 1920×1080 | 90f / 3s |
| 46 | Product Demo Flow | B — Text | 1920×1080 | 300f / 10s |
| 47 | Vertical Tip Card (9:16) | B — Text | 1080×1920 | 150f / 5s |
| 48 | Region / Market Callout | C — Data | 1920×1080 | 180f / 6s |
| 49 | Stacked Area Chart | C — Data | 1920×1080 | 210f / 7s |
| 50 | Vertical Outro + Stats (9:16) | H — CTA | 1080×1920 | 180f / 6s |

---

## ━━━ AGENT GENERATION RULES ━━━

When an AI agent (Claude Code, Cursor, Codex) generates or modifies a template using this skill, it MUST follow all rules below:

### MUST DO

1. **One file only** — all code lives in `Animation.tsx`. No separate `styles.ts`, no separate scene files.
2. **Export `propsSchema`** (Zod) and `type Props` from every file — the Nex form editor depends on these.
3. **Export `Animation` as a named export AND as `default`**.
4. **Use `loadFont()` from `@remotion/google-fonts/Inter`** — never raw CSS `@import`.
5. **Always `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"`** on every `interpolate()` call unless you have an explicit reason not to.
6. **Drive all animation from `frame`** — no `useState`, no `useEffect`, no `setInterval`.
7. **Use `spring()` for entrance animations** — entries should feel physical, not linear.
8. **Use `Sequence`** to divide multi-scene templates — never manually offset frame math across scenes.
9. **Keep font sizes proportional to `1920×1080`** — for 9:16 templates (`1080×1920`), scale font sizes up ~1.4×.
10. **Minimalistic aesthetic** — white/dark background, one accent color, Inter font, subtle shadow, clean layout.

### MUST NOT DO

1. ❌ Do NOT use `Math.random()` — use deterministic values from props or frame
2. ❌ Do NOT use `Date.now()` or `new Date()`
3. ❌ Do NOT use `fetch()`, `axios`, or any async call inside components
4. ❌ Do NOT use `localStorage`, `sessionStorage`, or browser APIs
5. ❌ Do NOT import from `react-spring`, `framer-motion`, or any non-Remotion animation library
6. ❌ Do NOT use `CSS animations` or `transition` properties — Remotion handles all timing
7. ❌ Do NOT use neon colors, drop shadows on text, Comic Sans, or gradient-heavy backgrounds
8. ❌ Do NOT create files other than `Animation.tsx` — the pipeline expects exactly one file
9. ❌ Do NOT leave `durationInFrames` undefined — always specify in the composition
10. ❌ Do NOT animate 3D objects / shaders on their own — always drive from `frame`

### Validation Checklist (pre-render)

Before a generated `Animation.tsx` enters the render queue, the Nex pipeline runs:

```bash
# Step 1: TypeScript check
tsc --noEmit Animation.tsx

# Step 2: 10-frame dry run
npx remotion render Animation --frames 0-10

# Step 3: Full render (if both pass)
npx remotion render Animation --output out/video.mp4
```

If `tsc --noEmit` fails → reject and re-generate with the type error as feedback.  
If dry run fails → reject and re-generate with the render error as feedback.  
If pass rate < 65% → fall back to Claude Sonnet / GPT-4o as primary code-gen model.

---

## ━━━ PROPS SCHEMA CONVENTIONS ━━━

The Nex form editor auto-generates UI from the Zod schema. Follow these conventions:

| Zod type | Form element generated |
|----------|----------------------|
| `z.string()` | Text input |
| `z.string().default(url)` | URL input |
| `z.number()` | Number stepper |
| `z.boolean()` | Toggle switch |
| `z.array(z.string())` | Tag list editor |
| `z.array(z.object(...))` | Repeatable card editor |
| `z.enum([...])` | Dropdown select |
| `z.string().default("#hex")` | Color picker (detected by `#` prefix) |

Always provide `.default(value)` for every field — the form editor and LLM fine-tune depend on it.

---

*— END OF PART 2 (Templates 26–50) — Merge with SKILL.md (Part 1) to form the complete `dia` skill —*
