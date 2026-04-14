const payload = {
    model: "current",
    messages: [
        { role: "system", "content": "hello" },
        { role: "user", "content": "hi" }
    ],
    temperature: 0.7,
    stream: false
};

async function test() {
    try {
        const response = await fetch("https://four-bottles-smile.loca.lt/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Bypass-Tunnel-Reminder": "true",
                "Authorization": "Bearer sk-unsloth-8441470f2092247eaf5ce62a26e9c7f1",
                "User-Agent": "curl/8.5.0"
            },
            body: JSON.stringify(payload)
        });
        console.log("STATUS", response.status);
        console.log("TEXT", await response.text());
    } catch (e) {
        console.error(e);
    }
}

test();
