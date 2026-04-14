const fs = require('fs');

const daisy = fs.readFileSync('public/daisy_SKILL.md', 'utf8');
const nex = fs.readFileSync('public/Nex_SKILL_PART2.md', 'utf8');
const text = daisy + '\n' + nex;

const blocks = [...text.matchAll(/```tsx\n([\s\S]*?)```/g)];

console.log("Found " + blocks.length + " tsx blocks");

const templates = [];

for (const block of blocks) {
    const code = block[1];
    // extract template name from comments
    const templateMatch = code.match(/\/\/\s*TEMPLATE[^:]*:?\s*(.*)/i);

    // Actually, some components in daisy don't have // TEMPLATE comments...
    // Let's look for "const [Name]Scene =" 
    const componentMatch = code.match(/(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*\(\{/);

    if (templateMatch && componentMatch) {
        templates.push({ name: templateMatch[1].trim(), component: componentMatch[1] });
    } else if (componentMatch) {
        templates.push({ name: componentMatch[1], component: componentMatch[1] });
    }
}

console.log(templates);
