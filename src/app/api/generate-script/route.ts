const SYSTEM_PROMPT = `You are an AI video planner.

Return valid JSON only.

Rules:
- No markdown
- No explanations
- No notes
- No text outside JSON
- Maximum 4 scenes only
- Scene 1 must always be intro or hook
- Scene 2 and Scene 3 should explain the topic
- Scene 4 must always be outro
- Keep text short
- Keep each scene focused on one idea
- Only use available templates
- Only choose templates that match the scene meaning
- Use only one template per scene
- Keep duration short
- Use duration_frames only
- Use 30 FPS
- Total video should usually be between 480 and 720 frames
- Do not generate long narration
- Do not generate large paragraphs

Allowed scene_type values:
- hook
- explanation
- statistic
- comparison
- process
- summary
- outro

Allowed template values:
- clean_title_intro
- three_point_explainer
- concept_breakdown
- comparison_table
- bullet_list_reveal
- pros_cons_list
- cta_outro

Return JSON in this format:

{
  "title": "",
  "tone": "",
  "total_duration_frames": 0,
  "scenes": [
    {
      "scene_id": "scene_1",
      "scene_type": "hook",
      "duration_frames": 0,
      "text": "",
      "template": ""
    },
    {
      "scene_id": "scene_2",
      "scene_type": "explanation",
      "duration_frames": 0,
      "text": "",
      "template": ""
    },
    {
      "scene_id": "scene_3",
      "scene_type": "explanation",
      "duration_frames": 0,
      "text": "",
      "template": ""
    },
    {
      "scene_id": "scene_4",
      "scene_type": "outro",
      "duration_frames": 0,
      "text": "",
      "template": ""
    }
  ]
}s
`;

// ============================================================================
// SCRIPT GENERATION ROUTE FOR COLAB
// ============================================================================

export async function POST(req: Request) {
  const { prompt, duration } = await req.json();

  console.log("Script Generation - Prompt:", prompt, "Duration:", duration);

  const payload = {
    model: "gemma",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Topic: ${prompt}
Requested Video Duration: ${duration}

Strictly output valid JSON only.
Do not include any explanations, greetings, reasoning, or text outside of the JSON object.
Start your response directly with { and end with }.`
      }
    ],
    temperature: 0.1,
    stream: true,
    chat_template_kwargs: {
      enable_thinking: false
    }
  };

  try {
    const response = await fetch("https://praneshv29-scriptgen.hf.space/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Unsloth API error:", response.status, response.statusText);
      return Response.json({ error: `Colab API Error: Server returned ${response.status}. Make sure your Colab is running and the localtunnel URL is correct.` }, { status: response.status });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Process the stream and forward it cleanly to the frontend
    const proxyStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        let internalBuffer = "";
        let isThinking = false;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ""; // Keep the last incomplete line

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(dataStr);
                  const content = data.choices?.[0]?.delta?.content;
                  if (content) {
                    internalBuffer += content;

                    let textToEmit = "";
                    while (true) {
                      if (!isThinking) {
                        const thinkStart = internalBuffer.indexOf("<think>");
                        if (thinkStart !== -1) {
                          textToEmit += internalBuffer.substring(0, thinkStart);
                          isThinking = true;
                          internalBuffer = internalBuffer.substring(thinkStart + 7);
                        } else {
                          textToEmit += internalBuffer;
                          internalBuffer = "";
                          break;
                        }
                      } else {
                        const thinkEnd = internalBuffer.indexOf("</think>");
                        if (thinkEnd !== -1) {
                          isThinking = false;
                          internalBuffer = internalBuffer.substring(thinkEnd + 8);
                          // A common pattern is the model adding a newline after </think>
                          if (internalBuffer.startsWith("\n")) {
                            internalBuffer = internalBuffer.substring(1);
                          }
                        } else {
                          break; // wait for more
                        }
                      }
                    }
                    if (textToEmit) controller.enqueue(encoder.encode(textToEmit));
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }

          if (buffer.startsWith('data: ')) {
            const dataStr = buffer.slice(6).trim();
            if (dataStr !== '[DONE]') {
              try {
                const data = JSON.parse(dataStr);
                const content = data.choices?.[0]?.delta?.content;
                if (content && !isThinking) {
                  const cleanContent = content.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "");
                  if (cleanContent) controller.enqueue(encoder.encode(cleanContent));
                }
              } catch (e) { }
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
    console.error("Error calling Unsloth API:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
