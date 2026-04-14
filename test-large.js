const fs = require('fs');

async function test() {
  const fileContent = fs.readFileSync('src/app/api/generate-script/route.ts', 'utf8');
  const systemPromptRegex = /const SYSTEM_PROMPT = `([\s\S]*?)`;/;
  const match = fileContent.match(systemPromptRegex);
  if (!match) { console.error("No prompt found"); return; }
  const SYSTEM_PROMPT = match[1];
  
  const payload = {
    model: "current",
    messages: [
      { role: "system", "content": SYSTEM_PROMPT },
      { role: "user", "content": "Test animation" }
    ],
    temperature: 0.7,
    stream: false
  };

  try {
      const response = await fetch("https://four-bottles-smile.loca.lt/v1/chat/completions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Bypass-Tunnel-Reminder": "true",
              "Authorization": "Bearer sk-unsloth-8441470f2092247eaf5ce62a26e9c7f1",
          },
          body: JSON.stringify(payload)
      });
      console.log("STATUS:", response.status);
      console.log("TEXT:", await response.text());
  } catch(e) {
      console.error(e);
  }
}
test();
