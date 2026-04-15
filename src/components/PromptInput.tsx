"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import Link from "next/link";
import {
  ArrowUp,
  SquareArrowOutUpRight,
  Type,
  MessageCircle,
  Hash,
  BarChart3,
  Disc,
  type LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { examplePrompts } from "@/examples/prompts";

const iconMap: Record<string, LucideIcon> = {
  Type,
  MessageCircle,
  Hash,
  BarChart3,
  Disc,
};

export const MODELS = [
  { id: "gpt-5-mini", name: "GPT-5 Mini" },
  { id: "gpt-5.1-codex", name: "GPT-5.1 Codex" },
  { id: "gpt-5.1:none", name: "GPT-5.1 (No Reasoning)" },
  { id: "gpt-5.1:low", name: "GPT-5.1 (Low Reasoning)" },
  { id: "gpt-5.1:medium", name: "GPT-5.1 (Medium Reasoning)" },
  { id: "gpt-5.1:high", name: "GPT-5.1 (High Reasoning)" },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

export const DURATIONS = [
  { id: "30sec", name: "30 seconds", frames: 900 },
  { id: "1min", name: "1 minute", frames: 1800 },
  { id: "2min", name: "2 minutes", frames: 3600 },
  { id: "5min", name: "5 minutes", frames: 9000 },
  { id: "10min", name: "10 minutes", frames: 18000 },
] as const;

export type DurationId = (typeof DURATIONS)[number]["id"];

export type StreamPhase = "idle" | "reasoning" | "generating";

export interface PromptInputRef {
  triggerGeneration: () => void;
}

interface PromptInputProps {
  onCodeGenerated?: (code: string) => void;
  onStreamingChange?: (isStreaming: boolean) => void;
  onStreamPhaseChange?: (phase: StreamPhase) => void;
  onError?: (error: string) => void;
  variant?: "landing" | "editor";
  prompt?: string;
  onPromptChange?: (prompt: string) => void;
  /** Called when landing variant submits - receives prompt and duration for navigation */
  onNavigate?: (prompt: string, duration: DurationId) => void;
  /** Whether navigation is in progress (for landing variant) */
  isNavigating?: boolean;
  /** Called when duration selection changes */
  onDurationChange?: (duration: DurationId) => void;
  /** Whether to show the "View Code examples" link (landing variant) */
  showCodeExamplesLink?: boolean;
}

export const PromptInput = forwardRef<PromptInputRef, PromptInputProps>(
  function PromptInput(
    {
      onCodeGenerated,
      onStreamingChange,
      onStreamPhaseChange,
      onError,
      variant = "editor",
      prompt: controlledPrompt,
      onPromptChange,
      onNavigate,
      onDurationChange,
      isNavigating = false,
      showCodeExamplesLink = false,
    },
    ref,
  ) {
    const [uncontrolledPrompt, setUncontrolledPrompt] = useState("");
    const [duration, setDuration] = useState<DurationId>("1min");

    // Support both controlled and uncontrolled modes
    const prompt =
      controlledPrompt !== undefined ? controlledPrompt : uncontrolledPrompt;
    const setPrompt = onPromptChange || setUncontrolledPrompt;
    const [isLoading, setIsLoading] = useState(false);

    const runGeneration = async () => {
      if (!prompt.trim() || isLoading) return;

      setIsLoading(true);
      onStreamingChange?.(true);
      onStreamPhaseChange?.("reasoning");
      try {
        const response = await fetch("/api/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, duration }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `API error: ${response.status}`;
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        onStreamPhaseChange?.("generating");

        let fullJson = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });

          if (textChunk.includes('{"error":')) { // Graceful colab fail
            console.error("API error chunk:", textChunk);
            onError?.(textChunk);
            return;
          }

          fullJson += textChunk;
        }

        let parsedJson = null;
        try {
          parsedJson = JSON.parse(fullJson.trim());
        } catch (e) {
          console.error("Failed to parse JSON script. Showing raw.\n", e, "\nRaw:\n", fullJson);
          onCodeGenerated?.(`// JSON PARSE ERROR\n/*\n${fullJson}\n*/`);
          return;
        }

        // --- PHASE 2: Generate Code from JSON ---
        onStreamPhaseChange?.("generating"); // Or a new phase if desired
        const codeResponse = await fetch("/api/generate-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scriptJson: parsedJson }),
        });

        if (!codeResponse.ok) {
          const errorData = await codeResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Code generation error: ${codeResponse.status}`);
        }

        const codeReader = codeResponse.body?.getReader();
        if (!codeReader) throw new Error("No code response body");

        let fullCode = "";
        while (true) {
          const { done, value } = await codeReader.read();
          if (done) break;

          const codeChunk = decoder.decode(value, { stream: true });
          fullCode += codeChunk;
          onCodeGenerated?.(fullCode); // Stream the code to the editor
        }

      } catch (error) {
        console.error("Error in multi-step generation:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        onStreamingChange?.(false);
        onStreamPhaseChange?.("idle");
      }
    };

    // Expose triggerGeneration via ref
    useImperativeHandle(ref, () => ({
      triggerGeneration: runGeneration,
    }));

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      // Landing variant uses navigation instead of API call
      if (isLanding && onNavigate) {
        onNavigate(prompt, duration);
        return;
      }

      await runGeneration();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    const isLanding = variant === "landing";
    const isDisabled = isLanding ? isNavigating : isLoading;

    return (
      <div
        className={
          isLanding
            ? "flex flex-col items-center justify-center flex-1 px-4"
            : "flex flex-col gap-2"
        }
      >
        {isLanding && (
          <h1 className="text-5xl font-bold text-white mb-10 text-center">
            What do you want to create?
          </h1>
        )}

        <form
          onSubmit={handleSubmit}
          className={isLanding ? "w-full max-w-3xl" : ""}
        >
          <div className="bg-background-elevated rounded-xl border border-border p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your animation..."
              className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground-dim focus:outline-none resize-none overflow-y-auto ${isLanding
                ? "text-base min-h-[60px] max-h-[200px]"
                : "text-sm min-h-[40px] max-h-[150px]"
                }`}
              style={{ fieldSizing: "content" }}
              disabled={isDisabled}
            />

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <Select
                value={duration}
                onValueChange={(value) => {
                  const newDuration = value as DurationId;
                  setDuration(newDuration);
                  onDurationChange?.(newDuration);
                }}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-auto bg-transparent border-none text-muted-foreground hover:text-foreground transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background-elevated border-border">
                  {DURATIONS.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={d.id}
                      className="text-foreground focus:bg-secondary focus:text-foreground"
                    >
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                size="icon-sm"
                disabled={!prompt.trim() || isDisabled}
                loading={isDisabled}
                className="bg-foreground text-background hover:bg-gray-200"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center gap-1.5 mt-3 ${isLanding ? "justify-center mt-6 gap-2" : ""
              }`}
          >
            <span className="text-muted-foreground-dim text-xs mr-1">
              Prompt Examples
            </span>
            {examplePrompts.map((example) => {
              const Icon = iconMap[example.icon];
              return (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => setPrompt(example.prompt)}
                  style={{
                    borderColor: `${example.color}40`,
                    color: example.color,
                  }}
                  className={`rounded-full bg-background-elevated border hover:brightness-125 transition-all flex items-center gap-1 px-1.5 py-0.5 text-[11px]`}
                >
                  <Icon className="w-3 h-3" />
                  {example.headline}
                </button>
              );
            })}
          </div>

          {showCodeExamplesLink && (
            <div className="flex justify-center mt-4">
              <Link
                href="/code-examples"
                className="text-muted-foreground-dim hover:text-muted-foreground text-xs transition-colors flex items-center gap-1"
              >
                View Code examples
                <SquareArrowOutUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </form>
      </div>
    );
  },
);
