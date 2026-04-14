"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CodeEditor } from "../../components/CodeEditor";
import { AnimationPlayer } from "../../components/AnimationPlayer";
import { PageLayout } from "../../components/PageLayout";
import {
  PromptInput,
  type StreamPhase,
  type PromptInputRef,
  DURATIONS,
  type DurationId,
} from "../../components/PromptInput";
import { examples } from "../../examples/code";
import { useAnimationState } from "../../hooks/useAnimationState";

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const initialDurationId = (searchParams.get("duration") as DurationId) || "1min";

  const templateId = searchParams.get("templateId");
  const initialTemplate = templateId
    ? examples.find(e => e.id === templateId)
    : examples[0];

  const initialCode = initialTemplate?.code || examples[0]?.code || "";

  // If template is selected, use its duration/fps
  // Otherwise use the URL duration param or default
  const initialDurationFrames = templateId && initialTemplate
    ? initialTemplate.durationInFrames
    : (DURATIONS.find(d => d.id === initialDurationId)?.frames || 1800);

  // If we have an initial prompt from URL, start in streaming state
  // so syntax highlighting is disabled from the beginning
  const willAutoStart = Boolean(initialPrompt) && !templateId;
  // If templateId is present, we VALIDATE/COMPILE immediately but don't "stream" generation unless prompt is also there?
  // Actually, if templateId is there, we just want to show it.

  const [durationInFrames, setDurationInFrames] = useState<number>(
    initialDurationFrames,
  );
  const [fps, setFps] = useState(initialTemplate?.fps || examples[0]?.fps || 30);
  const [isStreaming, setIsStreaming] = useState(willAutoStart);
  const [streamPhase, setStreamPhase] = useState<StreamPhase>(
    willAutoStart ? "reasoning" : "idle",
  );
  const [prompt, setPrompt] = useState(initialPrompt);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  // If we loaded a template, we consider it "generated once" so preview shows up and code editor isn't empty
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(!!templateId);
  const [apiError, setApiError] = useState<string | null>(null);

  const { code, Component, error, isCompiling, durationInFrames: compiledDuration, setCode, compileCode } =
    useAnimationState(initialCode);

  // Debounce compilation
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isStreamingRef = useRef(isStreaming);
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Update duration if compiled code specifies one
  useEffect(() => {
    if (compiledDuration) {
      setDurationInFrames(compiledDuration);
    }
  }, [compiledDuration]);

  // Initial compile for template load
  useEffect(() => {
    if (templateId && initialTemplate) {
      compileCode(initialTemplate.code);
    }
  }, []); // Run once on mount if templateId exists

  useEffect(() => {
    const wasStreaming = isStreamingRef.current;
    isStreamingRef.current = isStreaming;

    // Compile when streaming ends
    if (wasStreaming && !isStreaming) {
      compileCode(codeRef.current);
    }
  }, [isStreaming, compileCode]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setHasGeneratedOnce(true);

      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Skip compilation while streaming - will compile when streaming ends
      if (isStreamingRef.current) {
        return;
      }

      // Set new debounce
      debounceRef.current = setTimeout(() => {
        compileCode(newCode);
      }, 500);
    },
    [setCode, compileCode],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleStreamingChange = useCallback((streaming: boolean) => {
    setIsStreaming(streaming);
    // Clear API error when starting a new generation
    if (streaming) {
      setApiError(null);
    }
  }, []);

  const handleApiError = useCallback((errorMessage: string) => {
    setApiError(errorMessage);
  }, []);

  // Auto-trigger generation if prompt came from URL AND NO template was selected
  const promptInputRef = useRef<PromptInputRef>(null);

  useEffect(() => {
    if (initialPrompt && !hasAutoStarted && promptInputRef.current && !templateId) {
      setHasAutoStarted(true);
      // Small delay to ensure component is mounted
      setTimeout(() => {
        promptInputRef.current?.triggerGeneration();
      }, 100);
    }
  }, [initialPrompt, hasAutoStarted, templateId]);

  return (
    <PageLayout showLogoAsLink>
      <div className="flex-1 flex flex-col min-w-0 px-12 pb-8 gap-8 overflow-hidden">
        <div className="flex-1 flex flex-col lg:flex-row overflow-auto lg:overflow-hidden gap-8">
          <CodeEditor
            code={hasGeneratedOnce ? code : ""}
            onChange={handleCodeChange}
            isStreaming={isStreaming}
            streamPhase={streamPhase}
            onRun={() => compileCode(code)}
          />
          <div className="shrink-0 lg:shrink lg:flex-[2.5] lg:min-w-0 lg:h-full">
            <AnimationPlayer
              Component={Component}
              durationInFrames={durationInFrames}
              fps={fps}
              onDurationChange={setDurationInFrames}
              onFpsChange={setFps}
              isCompiling={isCompiling}
              isStreaming={isStreaming}
              error={apiError || error}
              errorType={apiError ? "api" : "compilation"}
              code={code}
            />
          </div>
        </div>

        <PromptInput
          ref={promptInputRef}
          onCodeGenerated={handleCodeChange}
          onStreamingChange={handleStreamingChange}
          onStreamPhaseChange={setStreamPhase}
          onError={handleApiError}
          prompt={prompt}
          onPromptChange={setPrompt}
          onDurationChange={(durationId) => {
            const frames = DURATIONS.find((d) => d.id === durationId)?.frames;
            if (frames) {
              setDurationInFrames(frames);
            }
          }}
        />
      </div>
    </PageLayout>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
    </div>
  );
}

const GeneratePage: NextPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GeneratePageContent />
    </Suspense>
  );
};

export default GeneratePage;
