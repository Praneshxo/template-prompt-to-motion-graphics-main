const https = require('https');
const http = require('http');

const url = "https://tangy-numbers-hunt.loca.lt/v1/chat/completions";

const payload = JSON.stringify({
    model: "current",
    messages: [
        { role: "user", content: "Say hello in JSON: {\"message\": \"hello\"}" }
    ],
    temperature: 0.7,
    stream: false,
    max_tokens: 50
});

console.log("Sending test request to:", url);
console.log("Payload:", payload);

const urlObj = new URL(url);
const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "Bypass-Tunnel-Reminder": "true",
        "Authorization": "Bearer sk-unsloth-a73a520feffeac1279086ed9e53dfc03",
    }
};

const req = https.request(options, (res) => {
    console.log("\nStatus:", res.statusCode, res.statusMessage);
    console.log("Headers:", JSON.stringify(res.headers, null, 2));

    let data = "";
    res.on("data", chunk => { data += chunk; });
    res.on("end", () => {
        console.log("\nResponse body:", data.substring(0, 500));
    });
});

req.on("error", (e) => {
    console.error("Request error:", e.message);
});

req.setTimeout(15000, () => {
    console.error("Request timed out");
    req.destroy();
});

req.write(payload);
req.end();
