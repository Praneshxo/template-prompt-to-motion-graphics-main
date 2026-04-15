import { NextRequest, NextResponse } from "next/server";
import path from "path";
import os from "os";
import fs from "fs";

export const maxDuration = 300; // Allow up to 5 minutes for rendering

// Keep track of the bundle location globally to cache it between requests
let cachedBundleLocation: string | null = null;

export async function POST(request: NextRequest) {
    let outputPath: string | null = null;

    try {
        const body = await request.json();
        const {
            code,
            durationInFrames = 900,
            fps = 30,
        } = body as {
            code: string;
            durationInFrames?: number;
            fps?: number;
        };

        if (!code || typeof code !== "string") {
            return NextResponse.json({ error: "Missing or invalid code" }, { status: 400 });
        }

        // Dynamically import server-only packages to avoid bundling issues
        const { bundle } = await import("@remotion/bundler");
        const { renderMedia, selectComposition } = await import("@remotion/renderer");

        // The Remotion entry point (must be a registered Remotion Root)
        const entryPoint = path.join(process.cwd(), "src", "remotion", "index.ts");

        // Bundle the Remotion project (use cache if available)
        if (!cachedBundleLocation) {
            console.log("[render] No cached bundle found, bundling for the first time...");
            cachedBundleLocation = await bundle({
                entryPoint,
                webpackOverride: (config) => config,
            });
        } else {
            console.log("[render] Using cached bundle location:", cachedBundleLocation);
        }

        // Input props to pass to the composition
        const inputProps = { code };

        // Select the composition
        const composition = await selectComposition({
            serveUrl: cachedBundleLocation,
            id: "DynamicComp",
            inputProps,
        });

        // Override duration/fps if they differ
        const finalComposition = {
            ...composition,
            durationInFrames: durationInFrames || composition.durationInFrames,
            fps: fps || composition.fps,
        };

        // Write output to a temp file
        outputPath = path.join(os.tmpdir(), `remotion-render-${Date.now()}.mp4`);

        console.log("[render] Starting render with h264 codec...");
        await renderMedia({
            composition: finalComposition,
            serveUrl: cachedBundleLocation,
            codec: "h264",
            outputLocation: outputPath,
            inputProps,
        });

        // Read the rendered file
        const videoBuffer = fs.readFileSync(outputPath);

        return new NextResponse(new Uint8Array(videoBuffer), {
            status: 200,
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": `attachment; filename="animation.mp4"`,
                "Content-Length": String(videoBuffer.length),
            },
        });
    } catch (err) {
        console.error("[render] Detailed error:", err);
        // If bundling failed, clear the cache just in case
        if (err instanceof Error && err.message.includes("bundle")) {
            cachedBundleLocation = null;
        }
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: message }, { status: 500 });
    } finally {
        if (outputPath && fs.existsSync(outputPath)) {
            try { fs.unlinkSync(outputPath); } catch { }
        }
    }
}
