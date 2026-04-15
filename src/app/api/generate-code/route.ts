import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Cache for the system prompt
let cachedSystemPrompt: string | null = null;

export async function POST(req: NextRequest) {
    try {
        const { scriptJson } = await req.json();

        if (!scriptJson) {
            return Response.json({ error: "Missing scriptJson" }, { status: 400 });
        }

        // 1. Get the system prompt (Template Definitions)
        let systemPrompt = cachedSystemPrompt;
        if (!systemPrompt) {
            try {
                // Read the local file from public directory
                const filePath = path.join(process.cwd(), "public", "remotion_templates_full_1_to_50.md");
                systemPrompt = fs.readFileSync(filePath, "utf8");

                // Add specific instructions to the templates
                systemPrompt = `You are a Remotion Code Generator. 
Use the following template definitions to stitch together a single valid React file named Animation.tsx.

MODERN ANIMATION RULES:
1. Output ONLY the code for Animation.tsx. 
2. Do NOT use markdown code blocks.
3. Import everything needed from 'remotion' and '@remotion/google-fonts/Inter'.
4. Stitch the scenes from the provided JSON script using the templates defined below.
5. Ensure the final output is a complete, runnable Remotion component.

TEMPLATES:
${systemPrompt}`;

                cachedSystemPrompt = systemPrompt;
            } catch (error) {
                console.error("Error reading templates file:", error);
                return Response.json({ error: "Could not read template definitions" }, { status: 500 });
            }
        }

        // 2. Call the AI Agent (Agent 2) to generate the code
        const payload = {
            model: "gemma",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Generate the full Animation.tsx code for this script:\n\n${JSON.stringify(scriptJson, null, 2)}` }
            ],
            temperature: 0.1,
            stream: true
        };

        const response = await fetch("https://praneshv29-videocode.hf.space/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            return Response.json({ error: `Agent 2 Error: ${response.statusText}` }, { status: response.status });
        }

        // 3. Stream the response back to the client
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const proxyStream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                let buffer = "";
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const dataStr = line.slice(6).trim();
                                if (dataStr === '[DONE]') continue;
                                try {
                                    const data = JSON.parse(dataStr);
                                    const content = data.choices?.[0]?.delta?.content;
                                    if (content) {
                                        controller.enqueue(encoder.encode(content));
                                    }
                                } catch (e) { }
                            }
                        }
                    }
                } catch (streamError) {
                    console.error("Error piping stream:", streamError);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(proxyStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error: any) {
        console.error("Error in generate-code route:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
