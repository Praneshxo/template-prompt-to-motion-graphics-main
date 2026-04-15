"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  renderMediaOnWeb,
  RenderMediaOnWebProgress
} from "@remotion/web-renderer";
import { DynamicComp } from "../../../remotion/DynamicComp";

export const RenderControls: React.FC<{
  code: string;
  durationInFrames: number;
  fps: number;
}> = ({ code, durationInFrames, fps }) => {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!code?.trim()) return;

    setIsRendering(true);
    setProgress(0);
    setError(null);

    try {
      console.log("[render] Starting client-side render...");

      const result = await renderMediaOnWeb({
        composition: {
          id: "DynamicComp",
          component: DynamicComp,
          durationInFrames,
          fps,
          width: 1920,
          height: 1080,
          defaultProps: { code },
        },
        inputProps: { code },
        onProgress: (p: RenderMediaOnWebProgress) => {
          const percent = Math.round((p.encodedFrames / durationInFrames) * 100);
          setProgress(percent);
        },
      });

      const blob = await result.getBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRendering(false);

    } catch (err) {
      console.error("[render] Client-side render failed matching to recorder:", err);

      // Silent fallback to MediaRecorder if renderMediaOnWeb fails
      try {
        const canvas = document.querySelector("canvas");
        if (!canvas) throw new Error("Preview not found");

        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "video.webm";
          a.click();
          URL.revokeObjectURL(url);
          setIsRendering(false);
        };

        recorder.start();

        const startTime = Date.now();
        const durationMs = (durationInFrames / fps) * 1000;
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const p = Math.min(Math.round((elapsed / durationMs) * 100), 100);
          setProgress(p);
          if (p >= 100) clearInterval(interval);
        }, 100);

        setTimeout(() => {
          recorder.stop();
          clearInterval(interval);
        }, durationMs + 200);

      } catch (recorderErr) {
        setError("Download failed. Please check your browser support.");
        setIsRendering(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <Button
        onClick={handleDownload}
        disabled={isRendering || !code?.trim()}
        className="w-full relative overflow-hidden h-12 text-base font-semibold"
      >
        {isRendering && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all duration-300 pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        )}
        {isRendering ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {progress > 0 ? `Preparing... ${progress}%` : "Initializing..."}
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Download Video
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-400 text-center font-medium bg-red-400/10 py-1 rounded">
          {error}
        </p>
      )}

      {isRendering && (
        <p className="text-[10px] text-muted-foreground text-center animate-pulse">
          Generating video in your browser... Please keep this tab active.
        </p>
      )}
    </div>
  );
};
