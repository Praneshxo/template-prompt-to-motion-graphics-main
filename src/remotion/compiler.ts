import { useState, useEffect, useMemo, useRef } from "react";
import * as Babel from "@babel/standalone";
import React from "react";
import * as Remotion from "remotion";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import * as RemotionShapes from "@remotion/shapes";
import { Lottie } from "@remotion/lottie";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import * as Zod from "zod";

export interface CompilationResult {
  Component: React.ComponentType | null;
  error: string | null;
  durationInFrames?: number;
}

// Extract component body from full ES6 code with imports
function extractComponentBody(code: string): string {
  // Strip import lines
  const lines = code.split("\n");
  const nonImportLines = lines.filter(
    (line) => !line.trim().startsWith("import "),
  );
  const codeWithoutImports = nonImportLines.join("\n");

  // Match: export const Foo = <anything> => { ... };
  // Works with () =>, ({ a, b }: Props) =>, (props: Props) => etc.
  const match = codeWithoutImports.match(
    /export\s+const\s+\w+\s*=\s*[\s\S]*?=>\s*\{([\s\S]*)\};?\s*$/,
  );
  if (match) {
    // Extra safety: strip any import lines that snuck into the body
    const body = match[1].trim();
    return body
      .split("\n")
      .filter((l) => !l.trim().startsWith("import "))
      .join("\n");
  }

  // Fallback: strip imports and return code as-is
  return codeWithoutImports;
}

// Standalone compile function for use outside React components
export function compileCode(code: string): CompilationResult {
  if (!code?.trim()) {
    return { Component: null, error: "No code provided" };
  }

  // Strategy 1: Attempt to compile as a complete module (supports imports, exports, multiple components)
  try {
    const transformResult = Babel.transform(code, {
      presets: ["env", "react", "typescript"],
      filename: "dynamic.tsx",
    });

    if (transformResult.code) {
      const exports: any = {};
      const module = { exports };

      const requireFn = (name: string) => {
        if (name === "react") return React;
        if (name === "remotion") return { ...Remotion, AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Sequence };
        if (name === "@remotion/shapes") return RemotionShapes;
        if (name === "@remotion/lottie") return { Lottie };
        if (name === "@remotion/three") return { ThreeCanvas };
        if (name === "three") return THREE;
        if (name === "zod") return Zod;
        // Stub for any @remotion/google-fonts/* package — returns a no-op loadFont
        if (name.startsWith("@remotion/google-fonts")) {
          return { loadFont: () => ({ fontFamily: "Inter, sans-serif" }) };
        }
        // Unknown module: return empty object instead of throwing so Strategy 1 doesn't fall through
        console.warn(`[compiler] Unknown module '${name}' — returning empty stub`);
        return {};
      };

      const func = new Function("exports", "require", "module", "React", transformResult.code);
      func(exports, requireFn, module, React);

      // Find the component: default export, or named 'Main', or first exported function
      const Component = module.exports.default || module.exports.Main || Object.values(module.exports).find((v) => typeof v === "function");
      const durationInFrames = module.exports.durationInFrames;

      if (Component) {
        // Extract default props from propsSchema (or PropsSchema) so the component
        // always receives its expected prop types even when rendered without explicit props.
        const schema = module.exports.propsSchema || module.exports.PropsSchema;
        let defaultProps: Record<string, unknown> = {};
        if (schema && typeof schema.parse === "function") {
          try {
            defaultProps = schema.parse({});
          } catch {
            // schema.parse failed — defaultProps stay empty
          }
        }

        // Wrap the component to merge defaultProps with any incoming props
        const WrappedComponent = (incomingProps: Record<string, unknown>) =>
          Component({ ...defaultProps, ...incomingProps });
        // Preserve display name for React DevTools
        WrappedComponent.displayName = Component.displayName || Component.name || "Animation";

        return { Component: WrappedComponent, error: null, durationInFrames };
      }

    }
  } catch (e) {
    // If module compilation fails, fall back to the legacy body-extraction method below
  }

  try {
    const componentBody = extractComponentBody(code);
    const wrappedSource = `const DynamicAnimation = () => {\n${componentBody}\n};`;

    const transpiled = Babel.transform(wrappedSource, {
      presets: ["react", "typescript"],
      filename: "dynamic-animation.tsx",
    });

    if (!transpiled.code) {
      return { Component: null, error: "Transpilation failed" };
    }

    const Remotion = {
      AbsoluteFill,
      interpolate,
      useCurrentFrame,
      useVideoConfig,
      spring,
      Sequence,
    };

    const wrappedCode = `${transpiled.code}\nreturn DynamicAnimation;`;

    const createComponent = new Function(
      "React",
      "Remotion",
      "RemotionShapes",
      "Lottie",
      "ThreeCanvas",
      "THREE",
      "AbsoluteFill",
      "interpolate",
      "useCurrentFrame",
      "useVideoConfig",
      "spring",
      "Sequence",
      "useState",
      "useEffect",
      "useMemo",
      "useRef",
      "Rect",
      "Circle",
      "Triangle",
      "Star",
      "Polygon",
      "Ellipse",
      "Heart",
      "Pie",
      "makeRect",
      "makeCircle",
      "makeTriangle",
      "makeStar",
      "makePolygon",
      "makeEllipse",
      "makeHeart",
      "makePie",
      wrappedCode,
    );

    const Component = createComponent(
      React,
      Remotion,
      RemotionShapes,
      Lottie,
      ThreeCanvas,
      THREE,
      AbsoluteFill,
      interpolate,
      useCurrentFrame,
      useVideoConfig,
      spring,
      Sequence,
      useState,
      useEffect,
      useMemo,
      useRef,
      RemotionShapes.Rect,
      RemotionShapes.Circle,
      RemotionShapes.Triangle,
      RemotionShapes.Star,
      RemotionShapes.Polygon,
      RemotionShapes.Ellipse,
      RemotionShapes.Heart,
      RemotionShapes.Pie,
      RemotionShapes.makeRect,
      RemotionShapes.makeCircle,
      RemotionShapes.makeTriangle,
      RemotionShapes.makeStar,
      RemotionShapes.makePolygon,
      RemotionShapes.makeEllipse,
      RemotionShapes.makeHeart,
      RemotionShapes.makePie,
    );

    if (typeof Component !== "function") {
      return {
        Component: null,
        error: "Code must be a function that returns a React component",
      };
    }

    return { Component, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown compilation error";
    return { Component: null, error: errorMessage };
  }
}
